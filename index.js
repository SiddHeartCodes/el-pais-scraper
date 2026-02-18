require("dotenv").config();

const { Builder, By, until } = require("selenium-webdriver");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

/* ================== SETUP ================== */

if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}

/* ================== COOKIE HANDLER ================== */

async function handleCookies(driver) {
  try {
    await driver.sleep(3000);

    const buttons = await driver.findElements(By.css("button"));

    for (let btn of buttons) {
      const text = (await btn.getText()).toLowerCase();

      if (text.includes("aceptar") || text.includes("accept")) {
        await btn.click();
        console.log("🍪 Cookies accepted");
        await driver.sleep(2000);
        break;
      }
    }
  } catch {
    console.log("🍪 No cookie popup");
  }
}

/* ================== TRANSLATION ================== */

async function translate(text) {
  if (!text) return "";

  try {
    const res = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: "es|en"
        },
        timeout: 10000
      }
    );

    return res.data.responseData.translatedText;

  } catch {
    console.log("⚠️ Translation failed");
    return text;
  }
}

/* ================== IMAGE DOWNLOAD ================== */

async function downloadImage(url, name) {
  try {
    const res = await axios.get(url, {
      responseType: "stream"
    });

    res.data.pipe(
      fs.createWriteStream(path.join("images", name))
    );

  } catch {
    console.log("⚠️ Image download failed");
  }
}

/* ================== WORD ANALYSIS ================== */

function analyzeWords(titles) {

  const freq = {};
  let found = false;

  titles
    .filter(Boolean)
    .forEach(title => {

      const words = title
        .toLowerCase()
        .replace(/[^a-z ]/g, "")
        .split(" ");

      words.forEach(word => {

        if (word.length > 2) {
          freq[word] = (freq[word] || 0) + 1;
        }

      });
    });

  console.log("\n🔁 Repeated Words (>2 times):");

  Object.entries(freq).forEach(([w, c]) => {

    if (c > 2) {
      console.log(`${w}: ${c}`);
      found = true;
    }

  });

  if (!found) {
    console.log("No repeated words found.");
  }
}

/* ================== MAIN ================== */

async function main() {

  const driver = await new Builder()
    .forBrowser("chrome")
    .build();

  const translatedTitles = [];

  try {

    /* Open Opinion Page */
    await driver.get("https://elpais.com/opinion/");

    await handleCookies(driver);

    /* Wait for page load */
    await driver.wait(
      until.elementLocated(By.tagName("body")),
      15000
    );

    /* Scroll for lazy loading */
    await driver.executeScript("window.scrollTo(0, 1000)");
    await driver.sleep(3000);

    /* Get article links */
    await driver.wait(
      until.elementsLocated(By.css("article h2 a")),
      15000
    );

    const links = await driver.findElements(
      By.css("article h2 a")
    );

    const urls = [];

    for (let i = 0; i < 5 && i < links.length; i++) {
      urls.push(await links[i].getAttribute("href"));
    }

    /* Process each article */
    for (let i = 0; i < urls.length; i++) {

      console.log("\n============================");

      await driver.get(urls[i]);

      await handleCookies(driver);

      /* Wait until title has text */
      await driver.wait(async () => {

        try {
          const el = await driver.findElement(By.css("h1"));
          const text = await el.getText();
          return text.length > 5;
        } catch {
          return false;
        }

      }, 20000);

      /* Get title */
      let title = "";

      try {
        title = await driver
          .findElement(By.css("h1"))
          .getText();
      } catch {
        console.log("⚠️ Title not found");
      }

      console.log("📌 Title:", title || "N/A");

      /* Get content */
      let content = "";

      try {

        const paragraphs = await driver.findElements(
          By.css('[data-dtm-region="articulo_cuerpo"] p')
        );

        for (let p of paragraphs) {
          content += await p.getText() + "\n";
        }

      } catch {
        console.log("⚠️ Content not found");
      }

      console.log("\n📄 Content Preview:\n");
      console.log(content.substring(0, 1000) + "...");

      /* Get image */
      try {

        const img = await driver.findElement(
          By.css("figure img")
        );

        const src = await img.getAttribute("src");

        await downloadImage(
          src,
          `article_${i + 1}.jpg`
        );

        console.log("🖼 Image saved");

      } catch {
        console.log("⚠️ No image");
      }

      /* Translate title */
      const translated = await translate(title);

      console.log("🌍 English:", translated || "N/A");

      if (translated) {
        translatedTitles.push(translated);
      }

      await driver.sleep(2000);
    }

    /* Analyze words */
    analyzeWords(translatedTitles);

  }

  finally {

    await driver.quit();
  }
}

main();

