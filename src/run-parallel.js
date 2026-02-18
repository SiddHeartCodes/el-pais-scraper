const { spawn } = require("child_process");

const configs = [
  { browser: "Chrome", os: "Windows", osVersion: "11" },
  { browser: "Firefox", os: "Windows", osVersion: "10" },
  { browser: "Edge", os: "Windows", osVersion: "11" },
  { browser: "Chrome", os: "OS X", osVersion: "Ventura" },
  { browser: "Safari", os: "OS X", osVersion: "Monterey" }
];

function runTest(config, index) {

  return new Promise((resolve) => {

    const env = {
      ...process.env,
      BS_BROWSER: config.browser,
      BS_OS: config.os,
      BS_OS_VERSION: config.osVersion,
      RUN_ID: index
    };

    const proc = spawn("node", ["src/main.js"], { env });

    proc.stdout.on("data", data => {
      console.log(`[RUN ${index}] ${data}`);
    });

    proc.stderr.on("data", data => {
      console.error(`[RUN ${index} ERROR] ${data}`);
    });

    proc.on("close", resolve);
  });
}

async function main() {

  console.log("Starting parallel execution...\n");

  await Promise.all(
    configs.map((c, i) => runTest(c, i + 1))
  );

  console.log("\nAll parallel runs finished");
}

main();
