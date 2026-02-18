const axios = require("axios");
const { TRANSLATION_API, RETRY_COUNT } = require("../config/config");
const logger = require("../utils/logger");

async function translate(text) {
  if (!text) return "";

  for (let i = 1; i <= RETRY_COUNT; i++) {
    try {
      const res = await axios.get(TRANSLATION_API, {
        params: {
          q: text,
          langpair: "es|en"
        },
        timeout: 10000
      });

      const translated =
        res?.data?.responseData?.translatedText;

      if (translated) return translated;

    } catch {
      if (i === RETRY_COUNT) {
        logger.warn("Translation failed");
      }
    }
  }

  return text;
}

module.exports = translate;
