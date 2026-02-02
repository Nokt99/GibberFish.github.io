const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(dataDir);

const files = ["participants.json", "premium_links.json"];

files.forEach((file) => {
  const full = path.join(dataDir, file);
  fs.writeFileSync(full, JSON.stringify({}, null, 2));
  console.log("Reset:", file);
});

console.log("Monthly event reset complete.");
