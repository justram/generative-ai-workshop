#!/usr/bin/env node

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const timeoutMs = Number(process.env.GENAI_SMOKE_TIMEOUT_MS || 60000);
const outputDir = process.env.GENAI_SMOKE_OUTPUT_DIR
  ? path.resolve(process.env.GENAI_SMOKE_OUTPUT_DIR)
  : null;

function findDefaultExecutable() {
  const dist = path.join(root, "dist-electron");
  const explicit = process.argv[2];
  if (explicit) return path.resolve(explicit);

  if (process.platform === "win32") {
    const entries = fs.existsSync(dist) ? fs.readdirSync(dist) : [];
    const unpacked = path.join(dist, "win-unpacked", "Generative AI Workshop.exe");
    if (fs.existsSync(unpacked)) return unpacked;
    const portable = entries.find((entry) => /portable\.exe$/i.test(entry));
    if (portable) return path.join(dist, portable);
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

  throw new Error(
    "Could not find a packaged app executable. Pass the executable path as the first argument.",
  );
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
  const artifactDir = outputDir || path.join(tempDir, "artifacts");

  const child = spawn(executable, [], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      GENAI_ELECTRON_PORT: process.env.GENAI_ELECTRON_PORT || "49174",
      GENAI_ELECTRON_SMOKE_OUTPUT_DIR: artifactDir,
      GENAI_ELECTRON_SMOKE_RESULT: resultPath,
      GENAI_ELECTRON_USER_DATA_DIR: userDataDir,
    },
  });

  let stderr = "";
  let stdout = "";
  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
    process.stdout.write(chunk);
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
    process.stderr.write(chunk);
  });

  const result = await waitForResult(resultPath, child);
  if (child.exitCode === null) child.kill();

  if (outputDir) {
    await fsp.mkdir(outputDir, { recursive: true });
    await fsp.writeFile(
      path.join(outputDir, `packaged-smoke-${process.platform}.stdout.log`),
      stdout,
    );
    await fsp.writeFile(
      path.join(outputDir, `packaged-smoke-${process.platform}.stderr.log`),
      stderr,
    );
  }

  if (!result) {
    throw new Error(`Packaged app did not report smoke status within ${timeoutMs}ms.\n${stderr}`);
  }

  if (outputDir) {
    await fsp.mkdir(outputDir, { recursive: true });
    await fsp.copyFile(resultPath, path.join(outputDir, `packaged-smoke-${process.platform}.json`));
  }

  const failures = Array.isArray(result.failures) ? result.failures : [];
  if (!result.ok || failures.length > 0) {
    const summary = failures
      .slice(0, 12)
      .map((failure) => {
        const page = failure.page || failure.probe || "unknown";
        const language = failure.language ? ` ${failure.language}` : "";
        const reason =
          failure.loadError ||
          failure.interactionError ||
          failure.unexpectedVisibleErrors?.join("; ") ||
          failure.consoleErrors?.join("; ") ||
          failure.visibleErrors?.join("; ") ||
          "unknown failure";
        return `- ${page}${language}: ${reason}`;
      })
      .join("\n");
    throw new Error(
      `Packaged app smoke failed with ${failures.length} failure(s):\n${summary}\n${stderr}`,
    );
  }

  console.log(JSON.stringify({ executable, result }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
