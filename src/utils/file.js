const fs = require("fs");
const path = require("path");
const { IMAGE_DIR } = require("../config/config");

function ensureImageDir() {
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR);
  }
}

function getImagePath(name) {
  return path.join(IMAGE_DIR, name);
}

module.exports = {
  ensureImageDir,
  getImagePath
};
