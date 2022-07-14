import { Axios } from "axios";
import * as fs from "fs-extra";

export async function faucet(localPath: string) {
    let accountFile = await fs.readJSON(localPath);

    let axios = new Axios();

    let data = {
        address: accountFile[0].Address,
        coin: ["10000000uaura"]
    }

    await axios.post('http://localhost:4500/', {
        address: "aura1z2skq0d8u3ptqlwr7pm578723r7e07ecunsvuv",
        coin: ["10000000uaura"]
    });
}