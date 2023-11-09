// @ts-ignore
import { execSync } from "child_process";

/// !DESIGNED TO RUN ON GITLAB RUNNER

// !try to keep this dep-free so we don't have to install deps
// !should run on node 18 and up
// TODO: PACKAGE THIS UP AS A PRIVATE NPM PACKAGE FOR REUSE ACROSS PROJECTS
// TODO: UPDATE THE SCRIPT TO SUPPORT GLOBBING PATTERN

// ##############################################################################
// EDITABLE AREA
// ##############################################################################
const APP_DIR_REGEX = /^app\/([a-zA-Z-]+)\//; // REGEX to match app directory name

const CRITICAL_FILES = [
  ".gitlab-ci.yml",
  "docker-compose.prod.template.yml",
  "Dockerfile",
  "package-lock.json",
  "package.json",
  "env.production",
];

const CRITICAL_DIRECTORIES = ["packages/", ".gitlab/", "nginx/", "docker/", "templates/"];

// !EDITABLE - EACH KEY IS MAPPED TO THE NAME OF THE APP DIRECTORY IN THE MONOREPO (SEP-DASH)
// THIS IS USED FOR CREATING A CUSTOM TYPE FOR THE DEPLOYABLE JSON PAYLOAD
const DEPLOYABLE_PAYLOAD_KEYS = [
  "CLIENT_ACCOUNT",
  "CLIENT_AUTHENTICATION",
  "CLIENT_CUSTODY",
  "CLIENT_PRIMARIES",
  "CLIENT_SECONDARIES",
  "HELIUM_CUSTODY",
  "SILVER_ADMINISTRATION",
  "SILVER_AUTHENTICATION",
  "SILVER_DATAROOM",
  "SILVER_ONBOARDING",
  "SILVER_PRIMARIES",
  "GLOBAL",
] as const;

// ##############################################################################
// EDITABLE AREA END
// ##############################################################################

type TargetEnvironment = "exp-difc" | "dev-difc" | "uat-difc" | "staging-difc" | "prod-difc";

type AppChanges = Record<string, boolean>;

type FileChange = {
  changeType: string;
  filename: string;
};

type CriticalChangeParams = {
  changedFiles: FileChange[];
  criticalDirectories: string[];
  criticalFiles: string[];
};

type DeployableKey = (typeof DEPLOYABLE_PAYLOAD_KEYS)[number];

type DeployableJSONPayload = {
  [Key in DeployableKey as `CI_IS_DEPLOYABLE_${Key}`]: boolean;
};

// !DEPLOYABLE RULES
// 1. If there are no changed files, deploy
// 2. If there are changed files, but none of them are deployable, don't deploy
// 3. If there are changed files, and some of them are deployable, deploy

type CheckDeployableFilesOptions = {
  compareCommitSha: string; // Compare commit SHA
  currentCommitSha: string; // Current commit SHA
};

async function main() {
  // const isGitLabCI = process.env.GITLAB_CI;

  // if (isGitLabCI !== "true") {
  //   throw new Error("Not running on GitLab CI");
  // }

  const targetEnvironment = process.env.TARGET_ENVIRONMENT || "exp-difc";
  const currentCommitSha = process.env.CI_COMMIT_SHA || "684c96e588190210387e79cfd8dffcd1a2c89290";
  const compareCommitSha =
    process.env.CI_COMMIT_BEFORE_SHA || "7fdfb83abbc375a21f5a4e9bac081f05188c603d";

  if (!isTargetEnvironment(targetEnvironment)) {
    throw new Error("TARGET_ENVIRONMENT is undefined or invalid");
  }

  const deployableJson = await fetchDeployableChanges({
    compareCommitSha,
    currentCommitSha,
  });

  // !ONLY WAY TO NARROW DOWN THE TYPE OF DEPLOYABLE JSON PAYLOAD TO NON-NULLABLE TYPE OTHERWISE TS WILL COMPLAIN -> TODO: COME BACK TO FIX THIS PROPERLY
  if (deployableJson !== null) {
    await triggerDownstreamPipelines({
      targetEnvironment,
      deployableJson,
    });

    return;
  }

  // !NO DEPLOYABLE CHANGES DETECTED
  console.log("No deployable changes detected. Exiting with code 0.");
  return;
}

main().catch((error) => {
  console.error("Uh oh, something went wrong. Aborting.", error);
  process.exit(1);
});

async function fetchDeployableChanges({
  compareCommitSha,
  currentCommitSha,
}: CheckDeployableFilesOptions) {
  const basePayload: Partial<DeployableJSONPayload> = {
    CI_IS_DEPLOYABLE_GLOBAL: false,
  };

  // !CASE 1: NO CHANGED FILES AND NO PREVIOUS COMMIT SHA
  // !NOTE:
  // !The previous latest commit present on a branch or tag is always 0000000000000000000000000000000000000000
  // !for merge request pipelines,
  // !the first commit in pipelines for branches or tags,
  // !or when manually running a pipeline.
  if (compareCommitSha === "0000000000000000000000000000000000000000") {
    basePayload.CI_IS_DEPLOYABLE_GLOBAL = true;

    return basePayload;
  }

  const changedFiles = await getChangedFiles({
    compareCommitSha,
    currentCommitSha,
  });

  console.info("Checking deployable status", {
    currentCommitSha,
    compareCommitSha,
    changedFiles,
  });

  const criticalChangeDetected = await detectCriticalChanges({
    changedFiles,
    criticalDirectories: CRITICAL_DIRECTORIES,
    criticalFiles: CRITICAL_FILES,
  });

  // !CASE 2: CRITICAL CHANGE DETECTED
  // !SET GLOBAL DEPLOYABLE FLAG TO TRUE AND SKIP THE REST OF THE CHECKS
  if (criticalChangeDetected) {
    console.log("Critical change detected, deployable");

    basePayload.CI_IS_DEPLOYABLE_GLOBAL = true;

    return basePayload;
  }

  const appChanges = await detectAppChanges(changedFiles);

  // !CASE 3: APP CHANGE DETECTED
  // !SET DEPLOYABLE APP FLAGS TO TRUE AND SKIP THE REST OF THE CHECKS
  if (appChanges) {
    const payload = Object.entries(appChanges).reduce((acc, [appName, changed]) => {
      const envVar = `CI_IS_DEPLOYABLE_${appName.replace(/-/g, "_").toUpperCase()}`;

      acc[envVar as keyof DeployableJSONPayload] = changed;

      return acc;
    }, {} as DeployableJSONPayload); // Explicitly cast the accumulator to DeployableJSONPayload

    return payload;
  }

  // !CASE 4: NO CHANGES DETECTED, RETURN NULL
  return null;
}

async function triggerDownstreamPipelines({
  targetEnvironment,
  deployableJson,
}: {
  targetEnvironment: TargetEnvironment;
  deployableJson: Partial<DeployableJSONPayload>;
}) {
  try {
    // !NOTE: If the global deployable flag is true, we don't need to check the other flags
    if (deployableJson.CI_IS_DEPLOYABLE_GLOBAL) {
      console.log("Global deployable flag is true. Triggering single downstream pipeline.");
      await postGitLabPipelineTriggerApi({
        variables: {
          CI_IS_DEPLOYABLE_GLOBAL: "true",
          CI_TARGET_ENVIRONMENT: targetEnvironment,
        },
      });
      return;
    }

    const promises = [] as Promise<Response>[];

    for (const [key, isDeployable] of Object.entries(deployableJson)) {
      if (isDeployable) {
        console.log(`Triggering downstream pipeline for ${key}`);
        promises.push(
          postGitLabPipelineTriggerApi({
            variables: {
              [key]: "true",
              CI_TARGET_ENVIRONMENT: targetEnvironment,
            },
          })
        );

        const results = await Promise.allSettled(promises);

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            if (result.value) {
              console.log("result.value: ", result.value);

              console.log(`Downstream pipeline triggered for ${key}`);
            }
          }
        });
      }
    }
  } catch (error) {
    console.error("Error reading deployable.json", error);
    console.log("deployable.json does not exist. Exiting with code 0.");
    process.exit(0);
  }
}

// ################################################################################
// UTILITY FUNCTIONS

function isTargetEnvironment(env: any): env is TargetEnvironment {
  return ["exp-difc", "dev-difc", "uat-difc", "staging-difc", "prod-difc"].includes(env);
}

async function getChangedFiles({
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

async function detectCriticalChanges({
  changedFiles,
  criticalDirectories = [],
  criticalFiles = [],
}: CriticalChangeParams) {
  const hasCriticalFileChange = (filename: string) =>
    criticalFiles.includes(filename) ||
    criticalDirectories.some((dir) => new RegExp(`^${dir}`).test(filename));

  return changedFiles.some(({ filename }) => hasCriticalFileChange(filename));
}

async function detectAppChanges(changedFiles: FileChange[]) {
  console.log("changedFiles: ", changedFiles);
  const appChanges: AppChanges = {};

  for (const { filename } of changedFiles) {
    const match = filename.match(APP_DIR_REGEX);
    // APP_DIR_REGEX
    if (match) {
      appChanges[match[1]] = true;
    }
  }

  // Check if appChanges is empty
  if (Object.keys(appChanges).length === 0) {
    return null;
  }

  return appChanges;
}

async function postGitLabPipelineTriggerApi({ variables }: { variables: Record<string, string> }) {
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

  // !NOTE: This is the GitLab API endpoint for triggering downstream pipelines
  // !See https://docs.gitlab.com/ee/api/pipeline_triggers.html
  const apiUrl = `${process.env.CI_API_V4_URL}/projects/${process.env.CI_PROJECT_ID}/trigger/pipeline`;

  const formData = new FormData();
  formData.append("token", process.env.CI_JOB_TOKEN);
  formData.append("ref", process.env.CI_COMMIT_REF_NAME);

  for (const [key, value] of Object.entries(variables)) {
    // console.log(`Setting ${key} to ${value}`);
    formData.append(`variables[${key}]`, value);
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    console.log("response: ", response.statusText);
    return response;
  } catch (error) {
    throw new Error(`Error spawning downstream pipeline: ${error}`);
  }
}
