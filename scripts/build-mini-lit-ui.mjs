import { build } from "esbuild";
import { rmSync, readdirSync } from "node:fs";
import { join } from "node:path";

const shared = {
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["chrome120"],
  sourcemap: true,
  splitting: true,
  chunkNames: "chunks/[name]-[hash]",
  logLevel: "info",
};

const pagesDir = "src/pages";
const entryPoints = Object.fromEntries(
  readdirSync(pagesDir)
    .filter((file) => file.endsWith(".js"))
    .sort()
    .map((file) => [`pages/${file.replace(/\.js$/, "")}`, join(pagesDir, file)]),
);

rmSync("build/js", { recursive: true, force: true });

await build({
  ...shared,
  entryPoints,
  outdir: "build/js",
});
