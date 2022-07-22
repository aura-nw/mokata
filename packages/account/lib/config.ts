import * as path from "path";
import * as fs from "fs-extra";

export async function saveKey(pair: any) {
  //Get current path
  let currentDir = process.cwd();
  await verifyLocalPath(currentDir, pair);
}

async function verifyLocalPath(localPath: string, envPair: any) {
  let configPath = path.join(localPath, "env.json");

  if (fs.existsSync(configPath)) {
    //env json file exists
    await writeEnv(configPath, envPair);
  } else {
    //file do not exist then warm user
    console.warn("Do not exist env json file");
  }
}

async function writeEnv(localPath: string, envJson: any) {
  let file = path.join(localPath);
  try {
    let accountArr = await fs.readJSON(localPath);
    accountArr['account'].push(envJson);

    await fs.writeJson(file, accountArr);
  } catch (err) {
    console.error(err);
  }
}
