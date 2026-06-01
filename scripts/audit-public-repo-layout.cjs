#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");
const { readWorkshopRoutes } = require("./read-workshop-routes.cjs");

const ROOT = path.resolve(__dirname, "..");
const EXPECTED_REPO_NAME = "generative-ai-workshop";
const failures = [];

function fail(message) {
  failures.push(message);
}

function git(args) {
  return childProcess.execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function exists(...parts) {
  return fs.existsSync(path.join(ROOT, ...parts));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

function routeShell(route) {
  return route.file === "index.html" ? route.file : path.join("routes", route.file);
}

const rootHtml = fs
  .readdirSync(ROOT)
  .filter((file) => file.endsWith(".html"))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
const extraRootHtml = rootHtml.filter((file) => file !== "index.html");
if (extraRootHtml.length > 0) {
  fail(`Only index.html may live at repo root; found ${extraRootHtml.join(", ")}`);
}

for (const file of ["local-pi-auth.js", "native-polish.css", "cozy-workshop-theme.css"]) {
  if (exists(file)) fail(`Loose root runtime asset is not allowed: ${file}`);
}

for (const file of [
  "public/js/local-pi-auth.js",
  "public/css/native-polish.css",
  "public/css/cozy-workshop-theme.css",
]) {
  if (!exists(file)) fail(`Expected public asset is missing: ${file}`);
}

for (const dir of ["sales-screenshots", "verification-screenshots"]) {
  if (exists(dir)) fail(`Remove project-internal artifact directory: ${dir}/`);
}

const trackedFiles = git(["ls-files"]).split("\n").filter(Boolean);
const forbiddenTracked = trackedFiles.filter(
  (file) =>
    exists(file) &&
    (file.startsWith("build/js/") ||
      file === "build/icon.png" ||
      file.startsWith("build/icon.iconset/") ||
      file.startsWith("sales-screenshots/") ||
      file.startsWith("verification-screenshots/")),
);
if (forbiddenTracked.length > 0) {
  fail(`Generated/internal files are tracked: ${forbiddenTracked.slice(0, 12).join(", ")}`);
}

const packageJson = readJson("package.json");
const packageLock = readJson("package-lock.json");
if (packageJson.name !== EXPECTED_REPO_NAME) {
  fail(`package.json name must be ${EXPECTED_REPO_NAME}, got ${packageJson.name}`);
}
if (packageLock.name !== EXPECTED_REPO_NAME) {
  fail(`package-lock.json name must be ${EXPECTED_REPO_NAME}, got ${packageLock.name}`);
}
if (packageLock.packages?.[""]?.name !== EXPECTED_REPO_NAME) {
  fail(`package-lock root package name must be ${EXPECTED_REPO_NAME}`);
}

const remote = git(["remote", "get-url", "origin"]).trim();
const remoteName = remote
  .replace(/\.git$/, "")
  .split(/[/:]/)
  .pop();
if (remoteName !== EXPECTED_REPO_NAME) {
  fail(`origin remote must point to ${EXPECTED_REPO_NAME}, got ${remote}`);
}

const stalePattern =
  /\bgenerative-ai-workshop-tw\b|workshop-tw|sales-screenshots|verification-screenshots/;
const searchableExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".toml",
  ".ts",
  ".txt",
  ".yml",
  ".yaml",
]);
const staleHits = [];
for (const file of trackedFiles) {
  if (!exists(file)) continue;
  if (file.startsWith("node_modules/") || file.startsWith("build/js/")) continue;
  if (file === "scripts/audit-public-repo-layout.cjs") continue;
  if (!searchableExtensions.has(path.extname(file))) continue;
  const content = fs.readFileSync(path.join(ROOT, file), "utf8");
  if (stalePattern.test(content)) staleHits.push(file);
}
if (staleHits.length > 0) {
  fail(`Stale public-layout references found in: ${staleHits.join(", ")}`);
}

const routes = readWorkshopRoutes(ROOT);
for (const route of routes) {
  const shell = routeShell(route);
  if (!exists(shell)) {
    fail(`Route shell missing: ${shell}`);
    continue;
  }
  const html = fs.readFileSync(path.join(ROOT, shell), "utf8");
  if (!html.includes(`src="/build/js/pages/${route.entry}.js`)) {
    fail(`${shell} must load its page bundle from /build/js/pages/${route.entry}.js`);
  }
  if (!html.includes('href="/build/css/styles.css')) {
    fail(`${shell} must load generated CSS from /build/css/styles.css`);
  }
  if (!html.includes('href="/public/css/native-polish.css')) {
    fail(`${shell} must load native polish CSS from /public/css/native-polish.css`);
  }
  if (!html.includes('src="/public/js/local-pi-auth.js')) {
    fail(`${shell} must load auth UI from /public/js/local-pi-auth.js`);
  }
}

if (failures.length > 0) {
  console.error("Public repo layout audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Public repo layout audit passed.");
