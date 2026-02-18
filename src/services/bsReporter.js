async function markStatus(driver, status, reason = "") {

  try {

    await driver.executeScript(
      `browserstack_executor: {
        "action": "setSessionStatus",
        "arguments": {
          "status":"${status}",
          "reason":"${reason}"
        }
      }`
    );

  } catch {
    // Ignore reporting failures
  }
}

module.exports = markStatus;
