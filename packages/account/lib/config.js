"use strict";

const fs = require("fs-extra");
const path = require("path");

async function saveKey(pair) {
  //Get current path
  let currentDir = process.cwd();
  await verifyLocalPath(currentDir, pair);
}

async function verifyLocalPath(localPath, envPair) {
  let configPath = path.join(localPath, "env.json");

  if (fs.existsSync(configPath)) {
    //env json file exists
    await writeEnv(configPath, envPair);
  } else {
    //file do not exist then create env json file
    await createEnvFile(configPath);
    await writeEnv(configPath, envPair);
  }
}

async function createEnvFile(localPath) {
  let file = path.join(localPath);
  try {
    await fs.ensureFile(file);
    console.log("File account file created!");
  } catch (err) {
    console.error(err);
  }
}

async function writeEnv(localPath, envJson) {
  let file = path.join(localPath);
  try {
    let secretArr = [];
    let checkEmpty = await fs.readFile(localPath);
    secretArr.push(envJson);

    if(checkEmpty.length > 0){
      let secretPair = await fs.readJSON(localPath);
      secretArr.push(secretPair[0].Account);
    }
    
    await fs.writeJson(file, secretArr);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  saveKey
};
