/// !DESIGNED TO RUN ON GITLAB RUNNER

// !try to keep this dep-free so we don't have to install deps
// !should run on node 18 and up
// TODO: PACKAGE THIS UP AS A PRIVATE NPM PACKAGE FOR REUSE ACROSS PROJECTS
// TODO: UPDATE THE SCRIPT TO SUPPORT GLOBBING PATTERN

import {
  createJsonFromAppChanges,
  detectAppChanges,
  detectCriticalChanges,
  getChangedFiles,
  isTargetEnvironment,
  readDeployableConfig,
  triggerDownstreamPipeline,
  writeToJSONFile,
  type TargetEnvironment,
} from "./utils";

const criticalFiles = [
  ".gitlab-ci.yml",
  "docker-compose.prod.template.yml",
  "Dockerfile",
  "global_new.txt",
  "global.txt",
  "package-lock.json",
  "package.json",
];

const criticalDirectories = ["packages/", ".gitlab/", "nginx/", "docker/"];

// !DEPLOYABLE RULES
// 1. If there are no changed files, deploy
// 2. If there are changed files, but none of them are deployable, don't deploy
// 3. If there are changed files, and some of them are deployable, deploy

async function checkDeployableFiles() {
  const currentCommitSha = process.env.CI_COMMIT_SHA || "654badcba49f82d0482d1288886032dc9ab1843f";
  const compareCommitSha =
    process.env.CI_COMMIT_BEFORE_SHA || "5169292d2766c4ada749b68c57fac7513ed43a24";

  if (compareCommitSha === "0000000000000000000000000000000000000000") {
    // !NOTE:
    // !The previous latest commit present on a branch or tag is always 0000000000000000000000000000000000000000
    // !for merge request pipelines,
    // !the first commit in pipelines for branches or tags,
    // !or when manually running a pipeline.

    console.info("No previous commit found, skipping deployable check.");

    return;
  }

  try {
    const changedFiles = await getChangedFiles({
      compareCommitSha,
      currentCommitSha,
    });

    if (!changedFiles) {
      console.info("No changed files found, deployable");
      await writeToJSONFile({
        CI_IS_DEPLOYABLE_GLOBAL: true,
      });

      console.info("Finished checking deployable status");
      console.info("Wrote to deployable.json", {
        CI_IS_DEPLOYABLE_GLOBAL: true,
      });

      return;
    }

    console.info("Checking deployable status", {
      currentCommitSha,
      compareCommitSha,
      changedFiles,
    });

    const criticalChangeDetected = await detectCriticalChanges({
      changedFiles,
      criticalDirectories,
      criticalFiles,
    });

    if (criticalChangeDetected) {
      console.log("Critical change detected, deployable");
      await writeToJSONFile({
        CI_IS_DEPLOYABLE_GLOBAL: true,
      });

      console.info("Finished checking deployable status");
      console.info("Wrote to deployable.json", {
        CI_IS_DEPLOYABLE_GLOBAL: true,
      });

      return;
    }

    const appChanges = await detectAppChanges(changedFiles);
    const json = createJsonFromAppChanges(appChanges);

    await writeToJSONFile(json);

    console.info("Finished checking deployable status");
    console.info("Wrote to deployable.json", json);
  } catch (error) {
    console.error("Error checking deployable status", error);
  }
}

async function triggerDownstreamPipelines(targetEnvironment: TargetEnvironment) {
  try {
    const deployableJson = await readDeployableConfig();
    console.log("deployableJson: ", deployableJson);

    // !NOTE: If the global deployable flag is true, we don't need to check the other flags
    if (deployableJson.CI_IS_DEPLOYABLE_GLOBAL) {
      console.log("Global deployable flag is true. Triggering single downstream pipeline.");
      await triggerDownstreamPipeline({
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
          triggerDownstreamPipeline({
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

async function main() {
  const isGitLabCI = process.env.GITLAB_CI;

  if (isGitLabCI !== "true") {
    throw new Error("Not running on GitLab CI");
  }

  const targetEnvironment = process.env.TARGET_ENVIRONMENT;

  if (!isTargetEnvironment(targetEnvironment)) {
    throw new Error("TARGET_ENVIRONMENT is undefined or invalid");
  }

  await checkDeployableFiles();
  await triggerDownstreamPipelines(targetEnvironment);
}

main();
