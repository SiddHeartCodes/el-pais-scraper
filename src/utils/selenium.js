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
  safeFindAll
};
