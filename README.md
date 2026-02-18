# 📘 El País Opinion Scraper

### Selenium Automation Framework with BrowserStack Integration

------------------------------------------------------------------------

## 📌 Overview

This project is a **production-grade Selenium automation framework**
designed to demonstrate advanced web automation, scraping, and
cloud-based testing practices.

It showcases:

-   Automated web scraping
-   API integration
-   Text analysis
-   Cloud execution with BrowserStack
-   Defensive automation design

The framework navigates to the **El País Opinion section**, extracts
articles, processes content, and performs linguistic analysis, both
locally and in cloud environments.

------------------------------------------------------------------------

## 🚀 Key Features

-   Scrapes top 5 opinion articles
-   Extracts titles and full content
-   Downloads primary images
-   Translates titles to English
-   Performs word-frequency analysis
-   Supports local and cloud execution
-   Handles dynamic DOM updates
-   Implements robust failure recovery
-   Captures screenshots on errors

------------------------------------------------------------------------

## 🛠️ Tech Stack

| Technology         | Purpose                  |
|--------------------|--------------------------|
| Node.js            | Runtime Environment      |
| Selenium WebDriver | Browser Automation       |
| Axios              | API Requests             |
| BrowserStack       | Cloud Testing Platform   |
| dotenv             | Environment Management   |

------------------------------------------------------------------------

## 📁 Project Structure

    el-pais-scraper/
    │
    ├── src/
    │   ├── analysis/
    │   ├── config/
    │   ├── scraper/
    │   ├── services/
    │   ├── utils/
    │   ├── main.js
    │   └── run-parallel.js
    │
    ├── images/
    ├── screenshots/
    ├── .env
    ├── .gitignore
    ├── package.json
    └── README.md

### Structure Rationale

| Directory | Purpose                          |
|-----------|----------------------------------|
| config    | Centralized configuration        |
| utils     | Logging and helpers              |
| services  | API and BrowserStack utilities   |
| scraper   | Website-specific logic           |
| analysis  | Word processing                  |
| main.js   | Application entry point          |

This modular architecture improves scalability, testing, and maintainability.

------------------------------------------------------------------------

## ✅ Prerequisites

-   Node.js v18+
-   Google Chrome
-   BrowserStack Account
-   npm

------------------------------------------------------------------------

## 📦 Installation

### Clone Repository

``` bash
git clone <repository-url>
cd el-pais-scraper
```

### Install Dependencies

``` bash
npm install
```

------------------------------------------------------------------------

## 🔐 Environment Configuration

Create a `.env` file in the project root:

``` env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

⚠️ Do NOT commit this file.

------------------------------------------------------------------------

## ▶️ Running Locally

``` bash
npm start
```

If BrowserStack credentials are unavailable, the framework defaults to
local execution.

------------------------------------------------------------------------

## ☁️ Running on BrowserStack

With valid credentials:

``` bash
npm start
```

View execution at:

    https://automate.browserstack.com

------------------------------------------------------------------------

## 🌐 Multi-Browser Execution

``` bash
npm run parallel
```

Executes across multiple browser/OS configurations.

> Parallelism depends on account limits.

------------------------------------------------------------------------

## 📤 Output Behavior

For each article:

-   Displays Spanish title
-   Extracts full content
-   Logs content length
-   Downloads image (if available)
-   Prints translated title

After completion:

-   Displays repeated words
-   Terminates sessions safely

------------------------------------------------------------------------

## 📊 Word Analysis Logic

-   Converts to lowercase
-   Removes special characters
-   Ignores words \< 3 characters
-   Builds frequency map
-   Displays words with frequency \> 2

------------------------------------------------------------------------

## 🧠 Reliability Design

El País uses dynamic loading and ads.

This framework includes:

-   Explicit waits
-   Retry mechanisms
-   Timeout controls
-   Stale element recovery
-   Session monitoring
-   Article-level isolation

One failure never stops full execution.

------------------------------------------------------------------------

## ⚠️ Error Handling

Handled scenarios:

-   Missing titles
-   Absent content
-   Missing images
-   API failures
-   Network drops
-   Cloud session loss

Automatic screenshots on failure.

------------------------------------------------------------------------

## 📈 BrowserStack Validation

Each cloud run provides:

-   Video recording
-   Device/browser metadata
-   Console logs
-   Pass/Fail status

Available in Automate dashboard.

------------------------------------------------------------------------

## 🔒 Security Practices

-   Environment variables for secrets
-   No hardcoded credentials
-   Secure `.gitignore` usage

------------------------------------------------------------------------

## ⛔ Limitations

-   Possible rate limiting
-   Cloud IP blocking
-   Limited parallelism
-   No proxy rotation

------------------------------------------------------------------------

## 🔮 Future Enhancements

-   CI/CD pipelines
-   Advanced reporting
-   Mobile testing
-   Database storage
-   Proxy support
-   Test dashboards

------------------------------------------------------------------------

## 👤 Author

**Siddharth Chakravarty**\
Computer Science Engineer\
Automation & Testing Enthusiast

------------------------------------------------------------------------

## ⭐ Final Note

This framework reflects **real-world automation engineering practices**,
emphasizing:

-   Maintainability
-   Reliability
-   Scalability
-   Professional coding standards

Designed to meet enterprise-level expectations.
