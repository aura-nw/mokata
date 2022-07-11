"use strict";

const fs = require("fs-extra");
const path = require("path");

async function saveKey(pair) {
  //Get current path
  let currentDir = process.cwd();
  await verifyLocalPath(currentDir);
}

async function verifyLocalPath(localPath) {
  let configPath = path.join(localPath, "mokata-env.json");
  fs.access(configPath).catch(_e => {
    throw new Error(`Can not find env file.`);
  });
}

module.exports = {
    saveKey
}
