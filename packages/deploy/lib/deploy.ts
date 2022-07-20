'use strict';

// this file is written based on the following file: https://raw.githubusercontent.com/InterWasm/cw-plus-helpers/main/base.ts

import { DirectSecp256k1HdWallet, makeCosmoshubPath, OfflineSigner } from '@cosmjs/proto-signing';
import { GasPrice, HttpEndpoint } from '@cosmjs/stargate';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import axios from 'axios';
import fs from 'fs';

// generate HD wallet
async function generateWalletThenSaveToFile(filename: string, password: string) {
    const wallet = await DirectSecp256k1HdWallet.generate(12, {hdPaths: [makeCosmoshubPath(0)], prefix: 'aura'});
    const encryptedWallet = await wallet.serialize(password);
    fs.writeFileSync(`${filename}`, encryptedWallet, 'utf8');
    return wallet;
}

async function loadWalletFromFile (filename: string, password: string){
    const wallet = await DirectSecp256k1HdWallet.deserialize(fs.readFileSync(`${filename}`, 'utf8'), password);
    return wallet;
}

// ask for tokens
async function hitFaucet(config: {faucetUrl: string; faucetAmount: string;}, address: string){
    try {
        const response = await axios.post(config.faucetUrl, {
            address: address,
            coins: [config.faucetAmount]
        });
        console.log(response.data);
    } catch (err) {
        console.log("Unable to ask for token, please check if your faucet URL, wallet address and faucet Amount.");
        throw err;
    }
}

// get / create account, faucet if balance is zero, create signing client
async function setup (options: { 
        walletFilePath: string; walletFilePassword: string; rpcURL: string | HttpEndpoint; 
        addressPrefix: string; gasPrice: GasPrice; feeToken: string; faucetUrl: string; faucetAmount: string;}) {
    // create / load wallet
    let wallet: OfflineSigner;
    console.log("Loading wallet ...");
    try {
        wallet = await loadWalletFromFile(options.walletFilePath, options.walletFilePassword);
    } catch(err) {
        wallet = await generateWalletThenSaveToFile(options.walletFilePath, options.walletFilePassword);
    }
    const address = (await wallet.getAccounts())[0].address;
    const client = await SigningCosmWasmClient.connectWithSigner(options.rpcURL, wallet, 
        { prefix: options.addressPrefix, gasPrice: options.gasPrice });

    // faucet: get sufficient balance to perform upload
    if(options.faucetUrl) {
        await hitFaucet(options, address);
        const currentBalance = await client.getBalance(address, options.feeToken);
        console.log(`current balance address "${address}": ${currentBalance.amount}${currentBalance.denom}`);
    }

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
