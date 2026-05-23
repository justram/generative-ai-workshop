import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);
const buildDir = path.resolve("build");
const iconsetDir = path.join(buildDir, "icon.iconset");
const sourcePng = path.join(buildDir, "icon-source.png");
const appPng = path.join(buildDir, "icon.png");
const icoPath = path.join(buildDir, "icon.ico");
const icnsPath = path.join(buildDir, "icon.icns");

await mkdir(buildDir, { recursive: true });
await copyFile(sourcePng, appPng);

if (process.platform !== "darwin") {
  if (!existsSync(icoPath)) {
    throw new Error(
      `Missing ${icoPath}. Regenerate icons on macOS and commit build/icon.ico before building Windows packages.`,
    );
  }
  console.log(`Using committed Windows icon at ${icoPath}`);
  process.exit(0);
}

await rm(iconsetDir, { recursive: true, force: true });
await mkdir(iconsetDir, { recursive: true });

const sizes = [
  [16, "icon_16x16.png"],
  [32, "icon_16x16@2x.png"],
  [32, "icon_32x32.png"],
  [64, "icon_32x32@2x.png"],
  [128, "icon_128x128.png"],
  [256, "icon_128x128@2x.png"],
  [256, "icon_256x256.png"],
  [512, "icon_256x256@2x.png"],
  [512, "icon_512x512.png"],
  [1024, "icon_512x512@2x.png"],
];

for (const [size, filename] of sizes) {
  await execFileAsync("sips", [
    "-z",
    String(size),
    String(size),
    sourcePng,
    "--out",
    path.join(iconsetDir, filename),
  ]);
}

await execFileAsync("iconutil", ["-c", "icns", iconsetDir, "-o", icnsPath]);

const icoPng = await readFile(path.join(iconsetDir, "icon_256x256.png"));
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader.writeUInt8(0, 6);
icoHeader.writeUInt8(0, 7);
icoHeader.writeUInt8(0, 8);
icoHeader.writeUInt8(0, 9);
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(icoPng.length, 14);
icoHeader.writeUInt32LE(22, 18);
await writeFile(icoPath, Buffer.concat([icoHeader, icoPng]));

console.log(`Generated app icons in ${buildDir}`);
