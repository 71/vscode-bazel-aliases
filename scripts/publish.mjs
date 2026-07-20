#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";

const targets = {
  vscode: {
    tokenEnv: "VSCE_PAT",
    publish: (vsixPath, pat) =>
      execFileSync("vsce", ["publish", "--packagePath", vsixPath, "--pat", pat], { stdio: "inherit" }),
  },
  "open-vsx": {
    tokenEnv: "OVSX_PAT",
    publish: (vsixPath, pat) =>
      execFileSync("ovsx", ["publish", vsixPath, "--pat", pat], { stdio: "inherit" }),
  },
};

const target = process.argv[2];
const config = targets[target];

if (!config) {
  console.error(`Unknown publish target ${JSON.stringify(target)}; expected one of: ${Object.keys(targets).join(", ")}`);
  process.exit(1);
}

const pat = process.env[config.tokenEnv];

if (!pat) {
  console.error(`Missing ${config.tokenEnv} environment variable`);
  process.exit(1);
}

const vsixFiles = readdirSync(".").filter((f) => f.endsWith(".vsix"));

if (vsixFiles.length !== 1) {
  console.error(`Expected exactly one .vsix file in the current directory, found ${vsixFiles.length}: ${vsixFiles.join(", ")}`);
  process.exit(1);
}

try {
  config.publish(vsixFiles[0], pat);
} catch (error) {
  process.exit(typeof error.status === "number" ? error.status : 1);
}
