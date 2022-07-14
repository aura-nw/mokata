import * as fs from "fs-extra";
import { dockerInit } from "./lib/docker"
import path from "path";
import { faucet } from "./lib/faucet";

/**
 * init
 */
export class InitConfig {
  async init() {
    await dockerInit();

    //Init connection json file
    let currentDir = process.cwd();
    let configPath = path.join(currentDir, "mokata-connection.json");
    let envPath = path.join(currentDir, "mokata-account.json");
  
    if (fs.existsSync(configPath)) {
      //env json file exists
      await writeEnv(configPath);
    } else {
      //file do not exist then create env json file
      await createEnvFile(configPath);
      await writeEnv(configPath);
    }

    await faucet(envPath);
  }
}

async function createEnvFile(localPath: string) {
  let file = path.join(localPath);
  try {
    await fs.ensureFile(file);
    console.log("File connection env created!");
  } catch (err) {
    console.error(err);
  }
}

async function writeEnv(localPath: string) {
  try {
    let file = path.join(localPath);
    let connectionJson = {
        chainId: 'aura-testnet',
        rpc: '127.0.0.1:26657',
        lcd: '127.0.0.1:1317',
        faucetApi: '127.0.0.1:4500'
    }

    await fs.writeFile(file, JSON.stringify(connectionJson), 'utf8');
  } catch (error) {
    
  }
}

