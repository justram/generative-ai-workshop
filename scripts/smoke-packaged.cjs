#!/usr/bin/env node

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const timeoutMs = Number(process.env.GENAI_SMOKE_TIMEOUT_MS || 60000);

function findDefaultExecutable() {
  const dist = path.join(root, "dist-electron");
  const explicit = process.argv[2];
  if (explicit) return path.resolve(explicit);

  if (process.platform === "win32") {
    const entries = fs.existsSync(dist) ? fs.readdirSync(dist) : [];
    const portable = entries.find((entry) => /portable\.exe$/i.test(entry));
    if (portable) return path.join(dist, portable);
    const unpacked = path.join(dist, "win-unpacked", "Generative AI Workshop.exe");
    if (fs.existsSync(unpacked)) return unpacked;
  }

  if (process.platform === "darwin") {
    const executable = path.join(
      dist,
      "mac",
      "Generative AI Workshop.app",
      "Contents",
      "MacOS",
      "Generative AI Workshop",
    );
    if (fs.existsSync(executable)) return executable;
  }

  throw new Error("Could not find a packaged app executable. Pass the executable path as the first argument.");
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fsp.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function waitForResult(filePath, child) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = await readJsonIfExists(filePath);
    if (result) return result;
    if (child.exitCode !== null) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return null;
}

async function main() {
  const executable = findDefaultExecutable();
  const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), "genai-workshop-smoke-"));
  const resultPath = path.join(tempDir, "smoke-result.json");
  const userDataDir = path.join(tempDir, "user-data");

  const child = spawn(executable, [], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      GENAI_ELECTRON_PORT: process.env.GENAI_ELECTRON_PORT || "49174",
      GENAI_ELECTRON_SMOKE_RESULT: resultPath,
      GENAI_ELECTRON_USER_DATA_DIR: userDataDir,
    },
  });

  let stderr = "";
  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
    process.stderr.write(chunk);
  });

  const result = await waitForResult(resultPath, child);
  if (child.exitCode === null) child.kill();

  if (!result) {
    throw new Error(`Packaged app did not report smoke status within ${timeoutMs}ms.\n${stderr}`);
  }
  if (!result.ok) {
    throw new Error(`Packaged app smoke failed:\n${JSON.stringify(result, null, 2)}\n${stderr}`);
  }

  console.log(JSON.stringify({ executable, result }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
