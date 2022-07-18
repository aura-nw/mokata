import * as path from "path";
import * as fs from "fs-extra";
import * as axios from "axios";
 
export async function faucetFile() {
  let currentDir = process.cwd();
  let file = path.join(currentDir, "env.json");
  try {
    let envJson = await fs.readJSON(file);

    const body = {
      address: envJson.account[0].Address,
      denom: "10000000uaura"
    };

    await axios.default.post(envJson.faucetApi, body);
  } catch (err) {
    console.error(err);
  }
}

export async function faucetAddress(address: string) {
  let currentDir = process.cwd();
  let file = path.join(currentDir, "env.json");
  try {
    let envJson = await fs.readJSON(file);

    const body = {
      address: address,
      denom: "10000000uaura"
    };

    await axios.default.post(envJson.faucetApi, body);
  } catch (err) {
    console.error(err);
  }
}