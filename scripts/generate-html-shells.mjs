#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORKSHOP_ROUTES } from "../src/mini-lit/workshop-routes.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");
const CSS_VERSION = "zh-tw8";
const NATIVE_POLISH_VERSION = "4";
const PAGE_BUNDLE_VERSION = "mini-lit-full-1";
const LOCAL_PI_AUTH_VERSION = "proper-i18n-1";

function themeBootstrap() {
  return `\t\t<!-- Immediately set theme to prevent flicker -->
\t\t<script>
\t\t\t(function () {
\t\t\t\tconst theme = localStorage.getItem("theme") || "system";
\t\t\t\tconst systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
\t\t\t\tconst actualTheme = theme === "system" ? systemTheme : theme;
\t\t\t\tdocument.documentElement.setAttribute("data-theme", actualTheme);
\t\t\t\tdocument.documentElement.classList.toggle("dark", actualTheme === "dark");
\t\t\t})();
\t\t</script>
`;
}

function renderShell(route) {
  const classAttr = route.htmlClass ? ` class="${route.htmlClass}"` : "";
  const bodyClass = route.bodyClass ? ` class="${route.bodyClass}"` : "";
  const bootstrap = route.includeThemeBootstrap ? themeBootstrap() : "";
  return `<!doctype html>
<html${classAttr} lang="zh-Hant-TW">
\t<head>
\t\t<meta charset="UTF-8" />
\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\t\t<title>${route.title}</title>
${bootstrap}\t\t<link rel="stylesheet" href="build/css/styles.css?v=${CSS_VERSION}" />
\t\t<link rel="stylesheet" href="native-polish.css?v=${NATIVE_POLISH_VERSION}" />
\t\t<script type="module" src="build/js/pages/${route.entry}.js?v=${PAGE_BUNDLE_VERSION}"></script>
\t</head>
\t<body${bodyClass}>
\t\t<script type="module" src="local-pi-auth.js?v=${LOCAL_PI_AUTH_VERSION}"></script>
\t</body>
</html>
`;
}

const failures = [];
for (const route of WORKSHOP_ROUTES) {
  const file = path.join(ROOT, route.file);
  const next = renderShell(route);
  if (checkOnly) {
    const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
    if (current !== next) failures.push(route.file);
  } else {
    fs.writeFileSync(file, next);
  }
}

if (failures.length > 0) {
  console.error("Generated HTML shells are stale:");
  for (const file of failures) console.error(`- ${file}`);
  console.error("Run: npm run generate:html-shells");
  process.exit(1);
}

console.log(
  checkOnly
    ? `HTML shell audit passed (${WORKSHOP_ROUTES.length} routes).`
    : `Generated ${WORKSHOP_ROUTES.length} HTML shells.`,
);
