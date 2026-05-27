const path = require("node:path");
const { readWorkshopRoutes } = require("./read-workshop-routes.cjs");

function listWorkshopPages(root, options = {}) {
  const { includeFullContent = false } = options;
  return readWorkshopRoutes(path.resolve(root))
    .filter((route) => includeFullContent || route.file !== "0-full-content.html")
    .filter((route) => route.smoke !== false || includeFullContent)
    .map((route) => route.file)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

module.exports = { listWorkshopPages };
