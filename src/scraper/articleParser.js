const { By } = require("selenium-webdriver");
const { safeFind } = require("../utils/selenium");

/*
 Utility: retry wrapper for stale elements
*/
async function retry(fn, attempts = 3) {

  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {

      if (
        err.name === "StaleElementReferenceError" ||
        err.message.includes("stale")
      ) {
        if (i === attempts) throw err;
        await new Promise(r => setTimeout(r, 800));
      } else {
        throw err;
      }
    }
  }
}

/* ================= TITLE ================= */

async function getTitle(driver) {

  return retry(async () => {

    const el = await safeFind(driver, By.css("h1"));

    if (!el) return "";

    return await el.getText();

  });
}

/* ================= CONTENT ================= */

async function getContent(driver) {

  return retry(async () => {

    let container = await safeFind(
      driver,
      By.css('[data-dtm-region="articulo_cuerpo"]'),
      8000
    );

    if (!container) {
      container = await safeFind(
        driver,
        By.css("article"),
        5000
      );
    }

    if (!container) return "";

    /* Re-fetch elements every time */
    const elements = await container.findElements(
      By.css("p, h2, blockquote")
    );

    let content = "";

    for (let i = 0; i < elements.length; i++) {

      const text = await elements[i].getText();

      if (text && text.trim().length > 20) {
        content += text.trim() + "\n\n";
      }
    }

    return content.trim();

  });
}

/* ================= IMAGE ================= */

async function getImage(driver) {

  return retry(async () => {

    let img = await safeFind(
      driver,
      By.css("figure img"),
      5000
    );

    if (!img) {
      img = await safeFind(
        driver,
        By.css("article img"),
        5000
      );
    }

    if (!img) return null;

    return await img.getAttribute("src");

  });
}

module.exports = {
  getTitle,
  getContent,
  getImage
};
