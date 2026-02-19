require("dotenv").config();

const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const config = require("./config/config");
const logger = require("./utils/logger");
const { ensureImageDir } = require("./utils/file");
const { waitForReady, forceSpanishLanguage } = require("./utils/selenium");

const handleCookies = require("./services/cookies");
const translate = require("./services/translator");
const downloadImage = require("./services/imageDownloader");

const getLinks = require("./scraper/articleLinks");
const parser = require("./scraper/articleParser");

const analyzeWords = require("./analysis/wordAnalyzer");

const takeScreenshot = require("./utils/screenshot");
const markStatus = require("./services/bsReporter");

/* ====================================================
   DRIVER FACTORY
==================================================== */

function createDriver() {

  const BS_USER = process.env.BROWSERSTACK_USERNAME;
  const BS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;

  /* BrowserStack Mode */
  if (BS_USER && BS_KEY) {

    const remoteUrl =
      `https://${BS_USER}:${BS_KEY}@hub-cloud.browserstack.com/wd/hub`;

    const browser = process.env.BS_BROWSER || "Chrome";
    const browserLower = browser.toLowerCase();

    const capabilities = {
      browserName: browser,
      browserVersion: "latest",

      "bstack:options": {
        os: process.env.BS_OS || "Windows",
        osVersion: process.env.BS_OS_VERSION || "11",

        sessionName: `El Pais Run ${process.env.RUN_ID || 1}`,
        buildName: "ElPais-Automation",

        seleniumVersion: "4.18.1",
        idleTimeout: 300
      }
    };

    /* Set Spanish language preference - universal approach */
    /* Try browser-specific capabilities first, then JavaScript will enforce it */
    if (browserLower === "chrome" || browserLower === "edge") {
      capabilities["goog:chromeOptions"] = {
        args: ["--lang=es-ES"],
        prefs: {
          "intl.accept_languages": "es-ES,es,en-US,en"
        }
      };
    } else if (browserLower === "firefox") {
      capabilities["moz:firefoxOptions"] = {
        prefs: {
          "intl.accept_languages": "es-ES,es,en-US,en",
          "general.useragent.locale": "es-ES"
        }
      };
    }
    /* Note: JavaScript injection in forceSpanishLanguage() will handle all browsers */

    const os = process.env.BS_OS || "Windows";
    const osVersion = process.env.BS_OS_VERSION || "11";

    logger.info(
      `Running on BrowserStack: ${browser} | ${os} ${osVersion} | Language: es-ES`
    );

    return new Builder()
      .usingServer(remoteUrl)
      .withCapabilities(capabilities)
      .build();
  }

  /* Local Mode */
  logger.info("Running locally with Spanish language preference");

  const options = new chrome.Options();
  options.addArguments("--lang=es-ES");
  options.setUserPreferences({
    "intl.accept_languages": "es-ES,es,en-US,en"
  });

  return new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

/* ====================================================
   SAFETY UTILITIES
==================================================== */

async function isDriverAlive(driver) {
  try {
    await driver.getTitle();
    return true;
  } catch {
    return false;
  }
}

async function safeNavigate(driver, url, retries = 3) {

  for (let i = 1; i <= retries; i++) {

    try {

      await driver.get(url);
      await waitForReady(driver);
      
      /* Force Spanish language universally after page load */
      await forceSpanishLanguage(driver);

      return;

    } catch (err) {

      if (i === retries) throw err;

      logger.warn(`Retrying navigation (${i})`);

      await driver.sleep(1500);
    }
  }
}

function withTimeout(promise, ms) {

  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Operation timeout")),
        ms
      )
    )
  ]);
}

/* ====================================================
   ARTICLE PROCESSOR
==================================================== */

async function processArticle(driver, url, index, results) {

  logger.info(`Processing article ${index + 1}`);

  /* Check session */
  if (!(await isDriverAlive(driver))) {
    throw new Error("WebDriver session not active");
  }

  /* Safe navigation */
  await safeNavigate(driver, url);

  await handleCookies(driver);

  /* Let dynamic content settle */
  await driver.sleep(1200);

  const title = await parser.getTitle(driver);
  const content = await parser.getContent(driver);
  const image = await parser.getImage(driver);

  /* Title */
  logger.info(`Title: ${title || "N/A"}`);

  /* Content */
  if (content) {

    logger.info(`Content length: ${content.length}`);

    console.log("\n----- Article Content -----\n");
    console.log(content);
    console.log("\n---------------------------\n");

  } else {

    logger.warn("No article content found");
  }

  /* Image */
  if (image) {

    const fileName = `article_${index + 1}.jpg`;

    await downloadImage(image, fileName);

    logger.info(`Image saved: ${fileName}`);

  } else {

    logger.warn("No image found");
  }

  /* Translation */
  const translated = await translate(title);

  logger.info(`Translated: ${translated || "N/A"}`);

  if (translated) {
    results.push(translated);
  }
}

/* ====================================================
   MAIN
==================================================== */

let globalDriver = null;

async function main() {

  ensureImageDir();

  let driver = await createDriver();
  globalDriver = driver;

  const translatedTitles = [];

  try {

    const session = await driver.getSession();

    logger.info(`Session ID: ${session.getId()}`);

    logger.info("Opening opinion page");

    await safeNavigate(driver, config.BASE_URL);

    await handleCookies(driver);

    /* Initial stabilization */
    await driver.sleep(1200);

    const urls = await getLinks(driver);

    if (!urls.length) {
      throw new Error("No articles found");
    }

    logger.info(`Found ${urls.length} articles`);

    /* Process each article independently */
    for (let i = 0; i < urls.length; i++) {

      try {

        console.log("\n-------------------------");

        await withTimeout(
          processArticle(
            driver,
            urls[i],
            i,
            translatedTitles
          ),
          120000 // 2 min per article
        );

      } catch (err) {

        await takeScreenshot(
          driver,
          `article_${i + 1}_error`
        );

        logger.warn(
          `Article ${i + 1} failed: ${err.message}`
        );
      }
    }

    console.log("\n=========================\n");

    analyzeWords(translatedTitles);

    /* Mark success */
    try {
      await markStatus(
        driver,
        "passed",
        "Execution completed successfully"
      );
    } catch {}

  } catch (err) {

    await takeScreenshot(driver, "run_failed");

    try {
      await markStatus(
        driver,
        "failed",
        err.message
      );
    } catch {}

    logger.error(err.message);

  } finally {

    if (driver) {

      try {
        await driver.quit();
      } catch {}

      logger.info("Driver closed");
    }
  }
}

/* ====================================================
   GRACEFUL SHUTDOWN
==================================================== */

process.on("SIGINT", async () => {

  console.log("\n[INFO] Graceful shutdown...");

  try {
    if (globalDriver) {
      await globalDriver.quit();
    }
  } catch {}

  process.exit(0);
});

/* ====================================================
   RUN
==================================================== */

main();
