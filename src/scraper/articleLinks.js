const { By } = require("selenium-webdriver");
const { waitForReady, safeFindAll } = require("../utils/selenium");
const { MAX_ARTICLES } = require("../config/config");

async function getArticleLinks(driver) {

  await waitForReady(driver);

  await driver.executeScript(
    "window.scrollTo(0, document.body.scrollHeight)"
  );

  await driver.sleep(1500);

  const links = await safeFindAll(
    driver,
    By.css("article h2 a")
  );

  const urls = [];

  for (const link of links) {
    if (urls.length >= MAX_ARTICLES) break;

    const href = await link.getAttribute("href");

    if (href && href.startsWith("http")) {
      urls.push(href);
    }
  }

  return urls;
}

module.exports = getArticleLinks;
