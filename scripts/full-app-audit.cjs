#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { listWorkshopPages } = require("./workshop-pages.cjs");

const root = path.resolve(__dirname, "..");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputDir = path.join(root, "test-results", "full-app-audit", timestamp);

function run(command, args, options = {}) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 24,
    shell: process.platform === "win32",
    ...options,
  });
  return {
    command: [command, ...args].join(" "),
    durationMs: Date.now() - started,
    status: result.status,
    ok: result.status === 0,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    error: result.error ? String(result.error.stack || result.error.message || result.error) : null,
  };
}

function runAsync(command, args, options = {}) {
  const started = Date.now();
  const timeoutMs = Number(options.timeoutMs || 180000);
  const spawnOptions = { ...options };
  delete spawnOptions.timeoutMs;
  const child = require("node:child_process").spawn(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
    ...spawnOptions,
  });
  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr?.on("data", (chunk) => {
    stderr += chunk.toString();
  });
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 3000).unref?.();
      resolve({
        command: [command, ...args].join(" "),
        durationMs: Date.now() - started,
        status: 124,
        ok: false,
        stdout,
        stderr,
        error: `Timed out after ${timeoutMs}ms`,
      });
    }, timeoutMs);
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({
        command: [command, ...args].join(" "),
        durationMs: Date.now() - started,
        status: 1,
        ok: false,
        stdout,
        stderr,
        error: String(error.stack || error.message || error),
      });
    });
    child.on("close", (status) => {
      clearTimeout(timer);
      resolve({
        command: [command, ...args].join(" "),
        durationMs: Date.now() - started,
        status,
        ok: status === 0,
        stdout,
        stderr,
        error: null,
      });
    });
  });
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

function pageShardFor(page) {
  if (page === "index.html" || page.startsWith("1-") || page.startsWith("2-")) return "core";
  if (page.startsWith("3-") || page.startsWith("4-")) return "sections-3-4";
  if (page.startsWith("5-")) return "section-5";
  return "sections-6-7";
}

function mergeShardReports(shards, probeShard) {
  const reports = [];
  for (const shard of [...shards, probeShard]) {
    const file = path.join(shard.outputDir, "audit-report.json");
    if (fs.existsSync(file)) reports.push(JSON.parse(fs.readFileSync(file, "utf8")));
  }
  const pageSet = new Set();
  const results = [];
  const probes = [];
  const findings = [];
  for (const report of reports) {
    for (const page of report.pages || []) pageSet.add(page);
    results.push(...(report.results || []));
    probes.push(...(report.probes || []));
    findings.push(...(report.findings || []));
  }
  findings.sort((a, b) => a.severity.localeCompare(b.severity));
  return {
    generatedAt: new Date().toISOString(),
    root,
    outputDir,
    baseUrl: process.env.BASE_URL || "http://127.0.0.1:4174",
    pages: [...pageSet].sort((a, b) => a.localeCompare(b, "en", { numeric: true })),
    languages: ["zh-TW", "en"],
    themes: ["light", "dark"],
    results,
    probes,
    findings,
    shardReports: reports.map((report) => ({
      outputDir: report.outputDir,
      pages: report.pages?.length || 0,
      results: report.results?.length || 0,
      probes: report.probes?.length || 0,
      findings: report.findings?.length || 0,
    })),
  };
}

function markdownValue(value) {
  if (typeof value === "string") return value;
  return `\`${JSON.stringify(value).slice(0, 700)}\``;
}

function writeMergedReport(report) {
  writeJson(path.join(outputDir, "audit-report.json"), report);
  const grouped = report.findings.reduce((map, finding) => {
    if (!map.has(finding.severity)) map.set(finding.severity, []);
    map.get(finding.severity).push(finding);
    return map;
  }, new Map());
  const lines = [];
  lines.push("# Full App Hybrid Audit Report", "");
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Base URL: ${report.baseUrl}`);
  lines.push(`- Pages: ${report.pages.length}`);
  lines.push(`- Render checks: ${report.results.length}`);
  lines.push(`- Interaction probes: ${report.probes.length}`);
  lines.push(`- Findings: ${report.findings.length}`);
  lines.push("- Execution: parallel page shards + dedicated probe shard", "");
  lines.push("## Summary", "");
  for (const severity of ["P0", "P1", "P2", "P3"]) {
    lines.push(`- ${severity}: ${(grouped.get(severity) || []).length}`);
  }
  lines.push("");
  for (const severity of ["P0", "P1", "P2", "P3"]) {
    const items = grouped.get(severity) || [];
    if (!items.length) continue;
    lines.push(`## ${severity} Findings`, "");
    for (const item of items) {
      const target = item.probe ? `${item.page} / ${item.probe}` : item.page;
      lines.push(
        `- **${item.type}** on \`${target}\` (${item.language}, ${item.theme}): ${markdownValue(item.detail)}`,
      );
      if (item.screenshot) lines.push(`  - Screenshot: \`${item.screenshot}\``);
    }
    lines.push("");
  }
  lines.push("## Probe Outcomes", "");
  for (const probe of report.probes) {
    lines.push(
      `- \`${probe.id}\` on \`${probe.page}\`: ${
        probe.findings?.length
          ? "findings"
          : probe.blocked
            ? "blocked by auth/offline state"
            : "passed"
      }`,
    );
  }
  fs.writeFileSync(path.join(outputDir, "audit-report.md"), lines.join("\n"));
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const status = run("git", ["status", "--short"]);
  const head = run("git", ["rev-parse", "--short", "HEAD"]);
  const preflight = [
    run("npm", ["run", "build:ui"]),
    run("npm", ["run", "check"]),
    run("npm", ["run", "audit:localization"]),
  ];

  const pages = listWorkshopPages(root);
  const pagesByShard = pages.reduce((map, page) => {
    const shard = pageShardFor(page);
    if (!map.has(shard)) map.set(shard, []);
    map.get(shard).push(page);
    return map;
  }, new Map());
  const shards = [...pagesByShard.entries()].map(([name, shardPages]) => ({
    name,
    pages: shardPages,
    outputDir: path.join(outputDir, "shards", name),
  }));
  const probeShard = {
    name: "probes",
    pages: [],
    outputDir: path.join(outputDir, "shards", "probes"),
  };
  const shardRuns = await Promise.all([
    ...shards.map((shard) =>
      runAsync(
        "npx",
        [
          "electron",
          "scripts/full-app-browser-audit.cjs",
          `--pages=${shard.pages.join(",")}`,
          "--no-probes",
        ],
        {
          timeoutMs: 240000,
          env: {
            ...process.env,
            FULL_APP_AUDIT_OUTPUT_DIR: shard.outputDir,
            BASE_URL: process.env.BASE_URL || "http://127.0.0.1:4174",
          },
        },
      ),
    ),
    runAsync("npx", ["electron", "scripts/full-app-browser-audit.cjs", "--only-probes"], {
      timeoutMs: 240000,
      env: {
        ...process.env,
        FULL_APP_AUDIT_OUTPUT_DIR: probeShard.outputDir,
        BASE_URL: process.env.BASE_URL || "http://127.0.0.1:4174",
      },
    }),
  ]);
  const browserAudit = {
    command: "parallel full-app-browser-audit shards",
    ok: shardRuns.every((run) => run.ok),
    status: shardRuns.every((run) => run.ok) ? 0 : 1,
    shards,
    probeShard,
    shardRuns,
  };
  const mergedReport = mergeShardReports(shards, probeShard);
  writeMergedReport(mergedReport);

  const manifest = {
    generatedAt: new Date().toISOString(),
    root,
    outputDir,
    head: head.stdout.trim(),
    dirtyWorktree: status.stdout.trim().split("\n").filter(Boolean),
    preflight,
    browserAudit,
  };
  writeJson(path.join(outputDir, "audit-run.json"), manifest);

  const failed = preflight.filter((item) => !item.ok);
  if (!browserAudit.ok) failed.push(browserAudit);
  if (mergedReport.findings.length) {
    failed.push({
      command: "full-app-browser-audit findings",
      ok: false,
      status: 1,
      stdout: "",
      stderr: `${mergedReport.findings.length} audit finding(s) recorded in ${path.join(
        outputDir,
        "audit-report.md",
      )}`,
    });
  }
  const report = path.join(outputDir, "audit-report.md");
  const reportExists = fs.existsSync(report);
  console.log(`Full app audit output: ${outputDir}`);
  if (reportExists) console.log(`Report: ${report}`);
  if (failed.length) {
    console.error(`Full app audit completed with ${failed.length} failed command(s).`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
