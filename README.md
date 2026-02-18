# El País Opinion Scraper – Selenium + BrowserStack

## Overview

This project is a Selenium-based automation framework demonstrating:

- Web scraping
- API integration
- Text processing
- Cross-browser execution using BrowserStack

The script performs the following:

- Navigates to the El País Opinion section (Spanish version)
- Extracts the first five articles
- Scrapes article titles and full content
- Downloads the primary article image (if available)
- Translates article titles to English using a translation API
- Performs word frequency analysis on translated titles
- Executes locally and on BrowserStack
- Handles dynamic DOM updates and flaky environments

The codebase is structured to reflect production-style automation practices with modular design and defensive handling.

---

## Tech Stack

- Node.js
- Selenium WebDriver
- Axios
- BrowserStack Automate
- dotenv

---

## Project Structure

el-pais-scraper/

- src/
  - analysis/
  - config/
  - scraper/
  - services/
  - utils/
  - main.js
  - run-parallel.js

- images/
- screenshots/
- .env
- .gitignore
- package.json
- README.md

### Structure Rationale

- config/ – Centralized configuration
- utils/ – Logging, Selenium wrappers, file utilities
- services/ – Translation API, image downloading, BrowserStack reporting
- scraper/ – Website-specific scraping logic
- analysis/ – Word frequency analysis
- main.js – Orchestration layer

This separation improves clarity and maintainability.

---

## Prerequisites

- Node.js v18+
- Google Chrome (for local execution)
- BrowserStack account (for cloud execution)
- npm

---

## Installation

Clone the repository:

git clone <repository-url>
cd el-pais-scraper

Install dependencies:

npm install

---

## Environment Configuration

Create a .env file in the project root:

BROWSERSTACK_USERNAME=your_username  
BROWSERSTACK_ACCESS_KEY=your_access_key  

These credentials are required only for BrowserStack execution.

Do not commit the .env file.

---

## Running Locally

npm start

If BrowserStack credentials are not present, the script automatically runs in local mode.

---

## Running on BrowserStack

With valid credentials in .env:

npm start

The script switches automatically to BrowserStack mode.

Execution can be verified at:

https://automate.browserstack.com

---

## Multi-Browser Execution

npm run parallel

This executes the script sequentially across multiple browser/OS configurations.

Note: Actual parallel execution depends on BrowserStack account limits.

---

## Output Behavior

For each article, the script:

- Prints the Spanish title
- Prints full article content
- Logs content length
- Saves article image (if available)
- Logs confirmation of image save
- Prints translated English title

After completion:

- Displays repeated words (occurring more than twice)
- Closes the browser session gracefully

---

## Word Analysis Logic

- Titles normalized to lowercase
- Non-alphabet characters removed
- Words shorter than three characters ignored
- Frequency map constructed
- Words with frequency greater than two displayed

---

## Reliability Considerations

El País uses dynamic DOM updates, advertisements, and lazy loading.

The implementation includes:

- Explicit waits
- Navigation retries
- Timeout enforcement
- Stale element handling
- Session health checks
- Article-level failure isolation

Failures in one article do not terminate the full execution.

---

## Error Handling

The framework handles:

- Missing titles
- Missing content sections
- Articles without images
- Translation API failures
- Stale element references
- Network interruptions
- BrowserStack session termination

Screenshots are captured automatically on failure.

---

## BrowserStack Validation

Each BrowserStack execution provides:

- Recorded session video
- Environment metadata
- Console logs
- Pass/Fail status

These are available in the BrowserStack Automate dashboard.

---

## Security

- Credentials stored using environment variables
- No secrets hardcoded
- .env excluded from version control

---

## Limitations

- El País may apply rate limiting
- Cloud IPs may face soft blocking
- True parallelism depends on account quota
- No proxy rotation implemented

---

## Future Enhancements

- CI/CD integration
- Structured test reports
- Mobile device profiles
- Persistent storage of scraped data
- Proxy support

---

## Author

Siddharth Chakravarty
