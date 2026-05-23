#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const HASHED_RUNTIME_RE = /\/workshop-runtime\/[^"'`/]+-[A-Za-z0-9_]{6,}\.js\b/;
const HASHED_RUNTIME_FILE_RE = /[^/]+-[A-Za-z0-9_]{6,}\.js$/;
const IMPORT_RE = /(?:import|export)\s+(?:[^"'`]*?\s+from\s+)?["'`]([^"'`]+)["'`]/g;

const allowedLegacyWrappers = new Set([
  "src/workshop-runtime/AgentRuntime.js",
  "src/workshop-runtime/AgentSession.js",
  "src/workshop-runtime/Artifacts.js",
  "src/workshop-runtime/AuthToken.js",
  "src/workshop-runtime/CodeBlock.js",
  "src/workshop-runtime/DemoBase.js",
  "src/workshop-runtime/Dialog.js",
  "src/workshop-runtime/Input.js",
  "src/workshop-runtime/PreviewCodeToggle.js",
  "src/workshop-runtime/ProxyClient.js",
  "src/workshop-runtime/SelfHostingLab.js",
  "src/workshop-runtime/UiPrimitives.js",
  "src/workshop-runtime/demoCompanyConfig.js",
]);

const failures = [];

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(file));
    else if (entry.isFile() && file.endsWith(".js")) out.push(file);
  }
  return out;
}

function git(args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

const trackedBuildFiles = git(["ls-files", "build/js"]).split("\n").filter(Boolean);
if (trackedBuildFiles.length > 0) {
  failures.push(
    `Generated build/js files are tracked in git (${trackedBuildFiles.length} files). Run: git rm -r --cached build/js`,
  );
}

for (const file of listFiles(path.join(ROOT, "src"))) {
  const relativeFile = rel(file);
  const isLegacyRuntimeFile =
    relativeFile.startsWith("src/workshop-runtime/") &&
    HASHED_RUNTIME_FILE_RE.test(path.posix.basename(relativeFile));
  if (isLegacyRuntimeFile) continue;

  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(IMPORT_RE)) {
    const specifier = match[1];
    if (specifier.startsWith("../build/js") || specifier.startsWith("./build/js")) {
      failures.push(`${relativeFile} imports generated build output: ${specifier}`);
    }
    const normalizedImport = `${path.posix.dirname(relativeFile)}/${specifier}`.replaceAll(
      "/./",
      "/",
    );
    if (
      (HASHED_RUNTIME_RE.test(specifier) || HASHED_RUNTIME_RE.test(normalizedImport)) &&
      !allowedLegacyWrappers.has(relativeFile)
    ) {
      failures.push(
        `${relativeFile} imports a legacy hashed runtime module directly: ${specifier}`,
      );
    }
  }
}

const changedLegacyFiles = git(["status", "--porcelain", "--", "src/workshop-runtime"])
  .split("\n")
  .filter(Boolean)
  .map((line) => line.slice(3).trim())
  .filter((file) => HASHED_RUNTIME_FILE_RE.test(path.posix.basename(file)));

for (const file of changedLegacyFiles) {
  failures.push(
    `${file} is a legacy hashed runtime file with local changes. Move edits behind a stable facade instead.`,
  );
}

if (failures.length > 0) {
  console.error("Source/generated boundary audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Source/generated boundary audit passed.");
