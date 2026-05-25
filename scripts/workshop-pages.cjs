const fs = require("node:fs");

function listWorkshopPages(root, options = {}) {
  const { includeFullContent = false } = options;
  return fs
    .readdirSync(root)
    .filter((file) => file.endsWith(".html"))
    .filter((file) => includeFullContent || file !== "0-full-content.html")
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

module.exports = { listWorkshopPages };
