'use strict';

// this file is written based on the following file: https://raw.githubusercontent.com/InterWasm/cw-plus-helpers/main/base.ts

import { DirectSecp256k1HdWallet, makeCosmoshubPath, OfflineSigner } from '@cosmjs/proto-signing';
import { GasPrice, HttpEndpoint } from '@cosmjs/stargate';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import fs from 'fs';

async function loadWalletFromFile (filename: string, password: string){
    const wallet = await DirectSecp256k1HdWallet.deserialize(fs.readFileSync(`${filename}`, 'utf8'), password);
    return wallet;
}

// get / create account, faucet if balance is zero, create signing client
async function setup (options: { 
        walletFilePath: string; walletFilePassword: string; rpcURL: string | HttpEndpoint; 
        addressPrefix: string; gasPrice: GasPrice; feeToken: string}) {
    // create / load wallet
    console.log("Loading wallet ...");
    let wallet = await loadWalletFromFile(options.walletFilePath, options.walletFilePassword);

    const client = await SigningCosmWasmClient.connectWithSigner(options.rpcURL, wallet, 
        { prefix: options.addressPrefix, gasPrice: options.gasPrice });

    const address = (await wallet.getAccounts())[0].address;
    let currentBalance = await client.getBalance(address, options.feeToken);
    console.log(`Loaded wallet. Address: "${address}", balance: ${currentBalance.amount}${currentBalance.denom}`);

    return [address, client];
}

// deploy smart contract
async function deploy (client: SigningCosmWasmClient, walletAddress: string, wasmFilePath: string, uploadFee: number) {
    // create client and upload contract
    console.log("Deploying wallet ...");
    const wasmFile = fs.readFileSync(wasmFilePath);
    const result = await client.upload(walletAddress, wasmFile, uploadFee);
    console.log(`Deploy sucess:\n${JSON.stringify(result, null, 2)}`);
}

export { setup, deploy };
