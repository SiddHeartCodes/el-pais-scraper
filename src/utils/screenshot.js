const fs = require("fs");
const path = require("path");

function ensureDir() {
  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots");
  }
}

async function takeScreenshot(driver, name) {

  ensureDir();

  try {
    const image = await driver.takeScreenshot();

    const filePath = path.join(
      "screenshots",
      `${name}.png`
    );

    fs.writeFileSync(filePath, image, "base64");

    return filePath;

  } catch {
    return null;
  }
}

module.exports = takeScreenshot;
