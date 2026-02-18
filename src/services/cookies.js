const { By } = require("selenium-webdriver");
const { safeFindAll } = require("../utils/selenium");
const logger = require("../utils/logger");

async function handleCookies(driver) {
  try {
    const buttons = await safeFindAll(driver, By.css("button"), 8000);

    for (const btn of buttons) {
      const text = (await btn.getText()).toLowerCase();

      if (
        text.includes("aceptar") ||
        text.includes("accept") ||
        text.includes("agree")
      ) {
        await btn.click();
        logger.info("Cookie banner accepted");
        return;
      }
    }
  } catch {
    logger.warn("Cookie handling failed");
  }
}

module.exports = handleCookies;
