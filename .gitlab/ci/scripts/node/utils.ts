import { execSync } from "child_process";
import { readFile, writeFile } from "fs/promises";

export const DOTENV_FILEPATH = ".env";
export const JSON_FILEPATH = "deployable.json";

export type TargetEnvironment = "exp-difc" | "dev-difc" | "uat-difc" | "staging-difc" | "prod-difc";

export type AppChanges = Record<string, boolean>;

export type FileChange = {
  changeType: string;
  filename: string;
};

export type CriticalChangeParams = {
  changedFiles: FileChange[];
  criticalDirectories?: string[];
  criticalFiles?: string[];
};

export type DeployableConfig = Record<string, boolean>;

export function isTargetEnvironment(env: any): env is TargetEnvironment {
  return ["exp-difc", "dev-difc", "uat-difc", "staging-difc", "prod-difc"].includes(env);
}

export async function writeToDotenvFile(exportStr: string): Promise<void> {
  await writeFile(DOTENV_FILEPATH, exportStr);
}

export async function writeToJSONFile(appChanges: AppChanges): Promise<void> {
  await writeFile(JSON_FILEPATH, JSON.stringify(appChanges, null, 2));
}

export async function getChangedFiles({
  currentCommitSha,
  compareCommitSha,
}: {
  currentCommitSha: string;
  compareCommitSha: string;
}): Promise<FileChange[]> {
  const changeTypes = {
    M: "modified",
    A: "added",
    D: "deleted",
    R: "moved",
    R100: "moved (similarity percentage: 100%)", // !NOTE: this is a special case. IDK what to do with it
  };

  const output = execSync(
    `git diff --name-status ${compareCommitSha} ${currentCommitSha} `
  ).toString();

  console.log(output);
  const lines = output.trim().split("\n");
  return lines.map((line) => {
    const [change, filename] = line.split(/\s+/, 2);
    return { changeType: changeTypes[change], filename };
  });
}

export async function detectCriticalChanges({
  changedFiles,
  criticalDirectories = [],
  criticalFiles = [],
}: CriticalChangeParams) {
  const hasCriticalFileChange = (filename: string) =>
    criticalFiles.includes(filename) ||
    criticalDirectories.some((dir) => new RegExp(`^${dir}`).test(filename));

  return changedFiles.some(({ filename }) => hasCriticalFileChange(filename));
}

export async function detectAppChanges(changedFiles: FileChange[]) {
  const appChanges: AppChanges = {};

  for (const { filename } of changedFiles) {
    const match = filename.match(/^apps\/([a-zA-Z-]+)\//);

    if (match) {
      appChanges[match[1]] = true;
    }
  }

  return appChanges;
}

export function generateEnvVariable(identifier: string): string {
  const baseName = "CI_IS_DEPLOYABLE";
  const replacements = { "-": "_" };
  let envName = identifier;

  for (const [original, replacement] of Object.entries(replacements)) {
    envName = envName.replace(new RegExp(original, "g"), replacement);
  }

  return `${baseName}_${envName.toUpperCase()}`;
}

export function createExportString(appChanges: AppChanges): string {
  return Object.entries(appChanges)
    .map(([appName, changed]) => `${generateEnvVariable(appName)}=${changed}\n`)
    .join("");
}

export function createJsonFromAppChanges(appChanges: AppChanges): Record<string, boolean> {
  return Object.entries(appChanges).reduce((acc, [appName, changed]) => {
    acc[generateEnvVariable(appName)] = changed;
    return acc;
  }, {} as Record<string, boolean>);
}

export async function triggerDownstreamPipeline({
  variables,
}: {
  variables: Record<string, string>;
}) {
  // !KEEP TYPESCRIPT AND MYSELF HAPPY
  if (process.env.CI_JOB_TOKEN === undefined) {
    throw new Error("CI_JOB_TOKEN is undefined");
  }

  if (process.env.CI_COMMIT_REF_NAME === undefined) {
    throw new Error("CI_COMMIT_REF_NAME is undefined");
  }

  if (process.env.CI_PROJECT_ID === undefined) {
    throw new Error("CI_PROJECT_ID is undefined");
  }

  if (process.env.CI_API_V4_URL === undefined) {
    throw new Error("CI_API_V4_URL is undefined");
  }

  const formData = new FormData();

  formData.append("token", process.env.CI_JOB_TOKEN);
  formData.append("ref", process.env.CI_COMMIT_REF_NAME);

  for (const [key, value] of Object.entries(variables)) {
    console.log(`Setting ${key} to ${value}`);
    formData.append(`variables[${key}]`, value);
  }

  try {
    const response = await fetch(
      `${process.env.CI_API_V4_URL}/projects/${process.env.CI_PROJECT_ID}/trigger/pipeline`,
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("response: ", response.statusText);
    return response;
  } catch (error) {
    throw new Error(`Error spawning downstream pipeline: ${error}`);
  }
}

export async function readDeployableConfig(): Promise<DeployableConfig> {
  const fileContent = await readFile(JSON_FILEPATH, "utf8");
  return JSON.parse(fileContent);
}
