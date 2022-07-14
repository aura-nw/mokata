import * as fs from "fs-extra";
import path from "path";

/**
 * init
 */
class InitConfig {
  public async init() {
    //Init connection json file
    let currentDir = process.cwd();
    let configPath = path.join(currentDir, "mokata-connection.json");
  
    if (fs.existsSync(configPath)) {
      //env json file exists
      await writeEnv(configPath);
    } else {
      //file do not exist then create env json file
      await createEnvFile(configPath);
      await writeEnv(configPath);
    }
  }
}

async function createEnvFile(localPath: string) {
  let file = path.join(localPath);
  try {
    await fs.ensureFile(file);
    console.log("File env created!");
  } catch (err) {
    console.error(err);
  }
}

async function writeEnv(localPath: string) {
  try {
    let file = path.join(localPath);
    let connectionJson : {
        chainId: 'aura-testnet',
        rpc: '127.0.0.1:26657',
        lcd: '127.0.0.1:1317',
        faucetApi: '127.0.0.1:4500'
    }

    await fs.writeJSON(file, connectionJson);
  } catch (error) {
    
  }
}


export = InitConfig;
