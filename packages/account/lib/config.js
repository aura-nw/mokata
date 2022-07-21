"use strict";

const fs = require("fs-extra");
const path = require("path");
const { DirectSecp256k1HdWallet, makeCosmoshubPath } = require('@cosmjs/proto-signing');
const axios = require('axios');
const { SigningCosmWasmClient } = require('@cosmjs/cosmwasm-stargate');

async function saveKey(pair) {
  //Get current path
  let currentDir = process.cwd();
  await verifyLocalPath(currentDir, pair);
}

async function verifyLocalPath(localPath, envPair) {
  let configPath = path.join(localPath, "mokata-env.json");

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
    console.log("File env created!");
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
      secretArr.push(secretPair[0]);
    }
    
    await fs.writeJson(file, secretArr);
    console.log("Write env success!");
  } catch (err) {
    console.error(err);
  }
}

async function generateWalletThenSaveToFile(filename, password) {
  const wallet = await DirectSecp256k1HdWallet.generate(12, {hdPaths: [makeCosmoshubPath(0)], prefix: 'aura'});
  const encryptedWallet = await wallet.serialize(password);
  fs.writeFileSync(`${filename}`, encryptedWallet, 'utf8');

  const address = (await wallet.getAccounts())[0].address;
  
  return [wallet, address];
}

// ask for tokens
async function hitFaucet(faucetUrl, faucetAmount, address){
  try {
      const response = await axios.post(faucetUrl, {
          address: address,
          coins: [faucetAmount]
      });
      return response.config.data;
  } catch (err) {
      console.log("Unable to ask for token, please check if your faucet URL, wallet address and faucet Amount are in correct format.");
      console.log({faucetUrl, faucetAmount, address});
      throw err;
  }
}

async function loadWalletFromFile (filename, password){
  const wallet = await DirectSecp256k1HdWallet.deserialize(fs.readFileSync(`${filename}`, 'utf8'), password);
  return wallet;
}

async function getBalance (walletFilePath, password) {
    // create / load wallet
    let wallet = await loadWalletFromFile(walletFilePath, password);

    const client = await SigningCosmWasmClient.connectWithSigner("http://localhost:26657", wallet, 
        { prefix: "aura", gasPrice: "0.025uaura" });

    const address = (await wallet.getAccounts())[0].address;
    let currentBalance = await client.getBalance(address, "uaura");
    console.log(`Address: "${address}", balance: ${currentBalance.amount}${currentBalance.denom}`);

    return [address, client];
}

module.exports = {
  saveKey,
  generateWalletThenSaveToFile,
  hitFaucet,
  getBalance
};
