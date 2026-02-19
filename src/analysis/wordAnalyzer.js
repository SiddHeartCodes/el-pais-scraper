const logger = require("../utils/logger");

function analyze(titles) {

  const freq = new Map();

  for (const title of titles) {

    if (!title) continue;

    const words = title
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim()
      .split(/\s+/);

    for (const word of words) {
      freq.set(word, (freq.get(word) || 0) + 1);
    }
  }

  logger.info("Repeated words (count > 2):");

  let found = false;

  for (const [w, c] of freq.entries()) {
    if (c > 2) {
      console.log(`${w}: ${c}`);
      found = true;
    }
  }

  if (!found) {
    console.log("No repeated words found");
  }
}

module.exports = analyze;
