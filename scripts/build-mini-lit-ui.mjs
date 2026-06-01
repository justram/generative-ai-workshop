import { build } from "esbuild";
import { rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { WORKSHOP_ROUTES } from "../src/mini-lit/workshop-routes.js";

const shared = {
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["chrome120"],
  loader: {
    ".md": "text",
  },
  sourcemap: true,
  splitting: true,
  chunkNames: "chunks/[name]-[hash]",
  logLevel: "info",
};

const pagesDir = "src/pages";
const availablePages = new Set(readdirSync(pagesDir).filter((file) => file.endsWith(".js")));
const missingPages = WORKSHOP_ROUTES.map((route) => `${route.entry}.js`).filter(
  (file) => !availablePages.has(file),
);
if (missingPages.length > 0) {
  throw new Error(`Missing src/pages entries: ${missingPages.join(", ")}`);
}
const entryPoints = Object.fromEntries(
  WORKSHOP_ROUTES.map((route) => [`pages/${route.entry}`, join(pagesDir, `${route.entry}.js`)]),
);

rmSync("build/js", { recursive: true, force: true });

await build({
  ...shared,
  entryPoints,
  outdir: "build/js",
});
