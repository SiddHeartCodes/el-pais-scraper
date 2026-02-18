const axios = require("axios");
const fs = require("fs");
const { getImagePath } = require("../utils/file");
const logger = require("../utils/logger");

async function downloadImage(url, name) {
  if (!url || !url.startsWith("http")) return;

  try {
    const res = await axios.get(url, {
      responseType: "stream",
      timeout: 15000
    });

    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(
        getImagePath(name)
      );

      res.data.pipe(stream);

      stream.on("finish", resolve);
      stream.on("error", reject);
    });

  } catch {
    logger.warn(`Image download failed: ${name}`);
  }
}

module.exports = downloadImage;
