const { By, until } = require("selenium-webdriver");
const { TIMEOUT } = require("../config/config");

async function waitForReady(driver) {
  await driver.wait(async () => {
    const state = await driver.executeScript(
      "return document.readyState"
    );
    return state === "complete";
  }, TIMEOUT);
}

/* ================= UNIVERSAL LANGUAGE SETTER ================= */

/**
 * Forces Spanish language preference universally across all browsers
 * Uses JavaScript injection to set language preferences after page load
 */
async function forceSpanishLanguage(driver) {
  try {
    /* Set language via JavaScript - works on all browsers */
    await driver.executeScript(`
      /* Set document language */
      if (document.documentElement) {
        document.documentElement.lang = 'es';
        document.documentElement.setAttribute('lang', 'es');
      }
      
      /* Override navigator language */
      Object.defineProperty(navigator, 'language', {
        get: function() { return 'es-ES'; }
      });
      Object.defineProperty(navigator, 'languages', {
        get: function() { return ['es-ES', 'es', 'en-US', 'en']; }
      });
      
      /* Set Accept-Language header via meta tag (if supported) */
      let meta = document.querySelector('meta[http-equiv="Accept-Language"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.httpEquiv = 'Accept-Language';
        document.head.appendChild(meta);
      }
      meta.content = 'es-ES,es,en-US,en';
    `);
  } catch (err) {
    /* Silently fail - language setting is best effort */
  }
}

async function safeFind(driver, locator, timeout = TIMEOUT) {
  try {
    await driver.wait(until.elementLocated(locator), timeout);
    return await driver.findElement(locator);
  } catch {
    return null;
  }
}

async function safeFindAll(driver, locator, timeout = TIMEOUT) {
  try {
    await driver.wait(until.elementsLocated(locator), timeout);
    return await driver.findElements(locator);
  } catch {
    return [];
  }
}

module.exports = {
  waitForReady,
  safeFind,
  safeFindAll,
  forceSpanishLanguage
};
