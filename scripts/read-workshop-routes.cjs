const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function readWorkshopRoutes(root = path.resolve(__dirname, "..")) {
  const routeFile = path.join(root, "src", "mini-lit", "workshop-routes.js");
  const source = fs.readFileSync(routeFile, "utf8");
  const match = source.match(/export const WORKSHOP_ROUTES = (\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error(`Could not find WORKSHOP_ROUTES in ${routeFile}`);
  }
  return vm.runInNewContext(match[1], Object.create(null), {
    filename: routeFile,
    timeout: 1000,
  });
}

module.exports = { readWorkshopRoutes };
