#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const HASHED_RUNTIME_RE = /\/workshop-runtime\/[^"'`/]+-[A-Za-z0-9_]{6,}\.js\b/;
const HASHED_RUNTIME_FILE_RE = /[^/]+-[A-Za-z0-9_]{6,}\.js$/;
const IMPORT_RE = /(?:import|export)\s+(?:[^"'`]*?\s+from\s+)?["'`]([^"'`]+)["'`]/g;

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
  if (
    relativeFile.startsWith("src/workshop-runtime/") &&
    HASHED_RUNTIME_FILE_RE.test(path.posix.basename(relativeFile))
  ) {
    failures.push(
      `${relativeFile} is a hashed legacy runtime filename. Rename it behind a stable source module.`,
    );
  }

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
    if (HASHED_RUNTIME_RE.test(specifier) || HASHED_RUNTIME_RE.test(normalizedImport)) {
      failures.push(`${relativeFile} imports a hashed legacy runtime module: ${specifier}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Source/generated boundary audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Source/generated boundary audit passed.");
