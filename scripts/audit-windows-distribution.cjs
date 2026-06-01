#!/usr/bin/env node

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const asar = require("@electron/asar");
const { readWorkshopRoutes } = require("./read-workshop-routes.cjs");

const root = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = {
    dist: path.join(root, "dist-electron"),
    report: null,
    requireInstaller: false,
    requirePortable: false,
    strict: true,
  };

  for (const arg of argv) {
    if (arg.startsWith("--dist=")) args.dist = path.resolve(arg.slice("--dist=".length));
    else if (arg.startsWith("--report=")) args.report = path.resolve(arg.slice("--report=".length));
    else if (arg === "--require-installer") args.requireInstaller = true;
    else if (arg === "--require-portable") args.requirePortable = true;
    else if (arg === "--no-strict") args.strict = false;
    else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: node scripts/audit-windows-distribution.cjs [options]

Audits Windows distribution artifacts without executing Windows code. This is meant
to run cheaply on macOS/Linux after electron-builder creates win-unpacked or after
a full Windows package build.

Options:
  --dist=<path>          Distribution directory. Default: dist-electron
  --report=<path>        Write JSON report to this path
  --require-installer    Fail if the NSIS installer exe is missing
  --require-portable     Fail if the portable exe is missing
  --no-strict            Treat missing win-unpacked/app.asar as a warning
`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function add(list, severity, check, message, extra = {}) {
  list.push({ severity, check, message, ...extra });
}

function pass(report, check, message, extra) {
  add(report.checks, "pass", check, message, extra);
}

function warn(report, check, message, extra) {
  add(report.checks, "warn", check, message, extra);
  report.warnings.push({ check, message, ...extra });
}

function fail(report, check, message, extra) {
  add(report.checks, "fail", check, message, extra);
  report.failures.push({ check, message, ...extra });
}

function findFirst(entries, pattern) {
  return entries.find((entry) => pattern.test(entry));
}

function readPeInfo(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 0x40) {
    throw new Error("File is too small to be a PE executable");
  }
  if (buffer.toString("ascii", 0, 2) !== "MZ") {
    throw new Error("Missing MZ header");
  }

  const peOffset = buffer.readUInt32LE(0x3c);
  if (peOffset + 6 > buffer.length) {
    throw new Error("Invalid PE header offset");
  }
  if (buffer.toString("ascii", peOffset, peOffset + 4) !== "PE\u0000\u0000") {
    throw new Error("Missing PE signature");
  }

  const machine = buffer.readUInt16LE(peOffset + 4);
  const machineName =
    machine === 0x8664 ? "x64" : machine === 0xaa64 ? "arm64" : `unknown-0x${machine.toString(16)}`;
  return {
    size: buffer.length,
    machine,
    machineName,
  };
}

function normalizedAsarList(asarPath) {
  return new Set(asar.listPackage(asarPath).map((entry) => entry.replace(/^\/+/, "")));
}

function asarHas(list, file) {
  return list.has(file.replace(/^\/+/, ""));
}

function readAsarText(asarPath, file) {
  return asar.extractFile(asarPath, file.replace(/^\/+/, "")).toString("utf8");
}

function assertAsarFile(report, list, file, reason) {
  if (asarHas(list, file)) {
    pass(report, `asar:${file}`, `Found ${file}`, { reason });
  } else {
    fail(report, `asar:${file}`, `Missing ${file}`, { reason });
  }
}

function assertResourceFile(report, resourcesDir, file, reason) {
  const fullPath = path.join(resourcesDir, file);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    pass(report, `resource:${file}`, `Found resources/${file}`, { reason });
  } else {
    fail(report, `resource:${file}`, `Missing resources/${file}`, { reason });
  }
}

function shellPath(route) {
  return route.file === "index.html" ? route.file : path.posix.join("routes", route.file);
}

function checkExecutable(report, label, filePath, minBytes) {
  if (!filePath || !fs.existsSync(filePath)) {
    return false;
  }

  try {
    const info = readPeInfo(filePath);
    if (info.machineName !== "x64") {
      fail(report, `exe:${label}:arch`, `${label} is not x64`, { filePath, info });
      return true;
    }
    if (info.size < minBytes) {
      fail(report, `exe:${label}:size`, `${label} looks too small`, {
        filePath,
        size: info.size,
        minBytes,
      });
      return true;
    }
    pass(report, `exe:${label}`, `${label} is an x64 Windows PE executable`, {
      filePath,
      size: info.size,
    });
    return true;
  } catch (error) {
    fail(report, `exe:${label}`, `${label} is not a valid Windows PE executable`, {
      filePath,
      error: error.message,
    });
    return true;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = {
    ok: false,
    platform: process.platform,
    arch: process.arch,
    dist: args.dist,
    checkedAt: new Date().toISOString(),
    checks: [],
    warnings: [],
    failures: [],
  };

  if (!fs.existsSync(args.dist)) {
    fail(report, "dist:exists", `Distribution directory does not exist: ${args.dist}`);
  } else {
    pass(report, "dist:exists", `Distribution directory exists: ${args.dist}`);
  }

  const entries = fs.existsSync(args.dist) ? fs.readdirSync(args.dist).sort() : [];
  const installer = findFirst(entries, /win-x64-installer\.exe$/i);
  const portable = findFirst(entries, /win-x64-portable\.exe$/i);
  const winUnpacked = path.join(args.dist, "win-unpacked");
  const unpackedExe = path.join(winUnpacked, "Generative AI Workshop.exe");
  const resourcesDir = path.join(winUnpacked, "resources");
  const appAsar = path.join(resourcesDir, "app.asar");

  const hasInstaller = checkExecutable(
    report,
    "installer",
    installer ? path.join(args.dist, installer) : null,
    50 * 1024 * 1024,
  );
  const hasPortable = checkExecutable(
    report,
    "portable",
    portable ? path.join(args.dist, portable) : null,
    100 * 1024 * 1024,
  );
  const hasUnpackedExe = checkExecutable(
    report,
    "win-unpacked",
    fs.existsSync(unpackedExe) ? unpackedExe : null,
    50 * 1024 * 1024,
  );

  if (!hasInstaller) {
    const message =
      "NSIS installer not found. This is acceptable for quick local --win dir audits.";
    if (args.requireInstaller) fail(report, "installer:present", message);
    else warn(report, "installer:present", message);
  }
  if (!hasPortable) {
    const message = "Portable exe not found. This is acceptable for quick local --win dir audits.";
    if (args.requirePortable) fail(report, "portable:present", message);
    else warn(report, "portable:present", message);
  }
  if (!hasUnpackedExe) {
    const message = "win-unpacked executable is missing, so app.asar cannot be audited.";
    if (args.strict) fail(report, "win-unpacked:present", message);
    else warn(report, "win-unpacked:present", message);
  }

  if (fs.existsSync(appAsar)) {
    pass(report, "asar:present", `Found ${appAsar}`);
    const list = normalizedAsarList(appAsar);
    report.asarFileCount = list.size;

    for (const file of [
      "package.json",
      "electron/main.mjs",
      "server.mjs",
      "local-pi-auth.js",
      "LICENSE",
      "native-polish.css",
      "cozy-workshop-theme.css",
      "node_modules/@earendil-works/pi-ai/package.json",
    ]) {
      assertAsarFile(report, list, file, "Required by packaged Electron runtime");
    }

    for (const file of [
      "build/css/styles.css",
      "build/icon.ico",
      "build/icon.png",
      "build/icon.icns",
    ]) {
      assertResourceFile(report, resourcesDir, file, "Copied as extraResources for static serving");
    }

    const packageJson = JSON.parse(readAsarText(appAsar, "package.json"));
    if (packageJson.main === "electron/main.mjs") {
      pass(report, "package:main", "Packaged package.json points to electron/main.mjs");
    } else {
      fail(report, "package:main", "Packaged package.json has wrong main entry", {
        actual: packageJson.main,
      });
    }
    if (packageJson.license === "Apache-2.0") {
      pass(report, "package:license", "Packaged package.json uses Apache-2.0");
    } else {
      fail(report, "package:license", "Packaged package.json has unexpected license", {
        actual: packageJson.license,
      });
    }

    const routes = readWorkshopRoutes(root);
    for (const route of routes) {
      const routeShell = shellPath(route);
      assertAsarFile(report, list, routeShell, `Route shell for ${route.entry}`);
      assertResourceFile(
        report,
        resourcesDir,
        `build/js/pages/${route.entry}.js`,
        `Mini-lit bundle for ${route.file}`,
      );
      if (asarHas(list, routeShell)) {
        const html = readAsarText(appAsar, routeShell);
        const expectedScript = `build/js/pages/${route.entry}.js`;
        if (html.includes(expectedScript)) {
          pass(report, `route:${route.file}:script`, `${routeShell} loads ${expectedScript}`);
        } else {
          fail(
            report,
            `route:${route.file}:script`,
            `${routeShell} does not load expected bundle`,
            {
              expectedScript,
            },
          );
        }
      }
    }

    const forbiddenPrefixes = [
      "dist-electron/",
      ".local-auth/",
      "vendor/",
      ".git/",
      "test-results/",
    ];
    for (const prefix of forbiddenPrefixes) {
      const leaked = [...list].filter((file) => file.startsWith(prefix)).slice(0, 8);
      if (leaked.length) {
        fail(report, `asar:no-${prefix}`, `Packaged app contains forbidden ${prefix} files`, {
          examples: leaked,
        });
      } else {
        pass(report, `asar:no-${prefix}`, `No ${prefix} files packaged`);
      }
    }

    const sourceMaps = [...list].filter((file) => file.endsWith(".map"));
    if (sourceMaps.length) {
      warn(report, "asar:sourcemaps", "Packaged app contains source maps", {
        count: sourceMaps.length,
        examples: sourceMaps.slice(0, 8),
      });
    } else {
      pass(report, "asar:sourcemaps", "No source maps packaged");
    }
  } else if (args.strict) {
    fail(report, "asar:present", `Missing app.asar: ${appAsar}`);
  } else {
    warn(report, "asar:present", `Missing app.asar: ${appAsar}`);
  }

  report.ok = report.failures.length === 0;

  if (args.report) {
    await fsp.mkdir(path.dirname(args.report), { recursive: true });
    await fsp.writeFile(args.report, JSON.stringify(report, null, 2));
  }

  const summary = [
    `Windows distribution audit: ${report.ok ? "PASS" : "FAIL"}`,
    `dist: ${args.dist}`,
    `checks: ${report.checks.length}`,
    `warnings: ${report.warnings.length}`,
    `failures: ${report.failures.length}`,
  ].join("\n");
  console.log(summary);

  for (const item of report.warnings.slice(0, 12)) {
    console.warn(`WARN ${item.check}: ${item.message}`);
  }
  for (const item of report.failures.slice(0, 20)) {
    console.error(`FAIL ${item.check}: ${item.message}`);
  }

  if (!report.ok) process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
