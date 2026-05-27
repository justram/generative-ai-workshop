#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const uploadDir = path.join(root, "dist-electron", "google-drive-upload");
const expected = new Set([
  "Generative AI Workshop-1.0.0-macos.zip",
  "Generative AI Workshop-1.0.0-windows.zip",
  "LICENSE",
  "README.md",
]);

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(uploadDir)) {
  fail(`Missing upload folder: ${uploadDir}`);
}

const entries = fs.readdirSync(uploadDir).sort();
const extra = entries.filter((entry) => !expected.has(entry));
const missing = [...expected].filter((entry) => !entries.includes(entry));

if (missing.length) fail(`Upload folder is missing required file(s): ${missing.join(", ")}`);
if (extra.length) fail(`Upload folder has unexpected file(s): ${extra.join(", ")}`);

for (const entry of entries) {
  const fullPath = path.join(uploadDir, entry);
  const stat = fs.statSync(fullPath);
  if (!stat.isFile()) fail(`Upload entry is not a file: ${entry}`);
  if (entry.endsWith(".zip") && stat.size < 50 * 1024 * 1024) {
    fail(`Zip looks too small to be a packaged app: ${entry} (${stat.size} bytes)`);
  }
}

console.log(`Upload folder is clean: ${uploadDir}`);
for (const entry of entries) {
  const stat = fs.statSync(path.join(uploadDir, entry));
  console.log(`${entry}\t${(stat.size / 1024 / 1024).toFixed(entry.endsWith(".zip") ? 1 : 3)} MB`);
}
