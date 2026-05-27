#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { readWorkshopRoutes } = require("./read-workshop-routes.cjs");

const ROOT = path.resolve(__dirname, "..");
const ROUTES = readWorkshopRoutes(ROOT);
const ALLOWED_PAGE_HELPERS = new Set(["section-5-content.js"]);
const failures = [];

function exists(...parts) {
  return fs.existsSync(path.join(ROOT, ...parts));
}

function uniq(values) {
  return [...new Set(values)];
}

const files = ROUTES.map((route) => route.file);
const entries = ROUTES.map((route) => route.entry);
const duplicateFiles = files.filter((file, index) => files.indexOf(file) !== index);
const duplicateEntries = entries.filter((entry, index) => entries.indexOf(entry) !== index);
if (duplicateFiles.length > 0)
  failures.push(`Duplicate route files: ${uniq(duplicateFiles).join(", ")}`);
if (duplicateEntries.length > 0) {
  failures.push(`Duplicate route entries: ${uniq(duplicateEntries).join(", ")}`);
}

const rootHtmlFiles = fs
  .readdirSync(ROOT)
  .filter((file) => file.endsWith(".html"))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
const extraHtml = rootHtmlFiles.filter((file) => !files.includes(file));
const missingHtml = files.filter((file) => !rootHtmlFiles.includes(file));
if (extraHtml.length > 0)
  failures.push(`HTML files missing from route registry: ${extraHtml.join(", ")}`);
if (missingHtml.length > 0)
  failures.push(`Registered HTML files missing on disk: ${missingHtml.join(", ")}`);

const pageFiles = fs
  .readdirSync(path.join(ROOT, "src", "pages"))
  .filter((file) => file.endsWith(".js"))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
const expectedPageFiles = new Set(entries.map((entry) => `${entry}.js`));
const extraPageFiles = pageFiles.filter(
  (file) => !expectedPageFiles.has(file) && !ALLOWED_PAGE_HELPERS.has(file),
);
const missingPageFiles = [...expectedPageFiles].filter((file) => !pageFiles.includes(file));
if (extraPageFiles.length > 0) {
  failures.push(`src/pages files missing from route registry: ${extraPageFiles.join(", ")}`);
}
if (missingPageFiles.length > 0) {
  failures.push(`Registered src/pages entries missing on disk: ${missingPageFiles.join(", ")}`);
}

for (const route of ROUTES) {
  const htmlFile = path.join(ROOT, route.file);
  if (!fs.existsSync(htmlFile)) continue;
  const html = fs.readFileSync(htmlFile, "utf8");
  const expectedScript = `build/js/pages/${route.entry}.js`;
  const pageScripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((src) => src.startsWith("build/js/pages/"));
  if (pageScripts.length !== 1) {
    failures.push(`${route.file} must load exactly one page bundle, found ${pageScripts.length}`);
  } else if (!pageScripts[0].startsWith(expectedScript)) {
    failures.push(`${route.file} loads ${pageScripts[0]}, expected ${expectedScript}`);
  }
  if (html.includes("build/js/chunks/")) {
    failures.push(`${route.file} must not import generated chunk files directly`);
  }
  if (!exists("src", "pages", `${route.entry}.js`)) {
    failures.push(`${route.file} entry missing: src/pages/${route.entry}.js`);
  }
}

if (failures.length > 0) {
  console.error("Route audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Route audit passed (${ROUTES.length} routes).`);
