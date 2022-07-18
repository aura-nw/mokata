'use strict';

// this file is written based on the following file: https://raw.githubusercontent.com/InterWasm/cw-plus-helpers/main/base.ts
const ProtoSigning = require('@cosmjs/proto-signing');
const DirectSecp256k1HdWallet = ProtoSigning.DirectSecp256k1HdWallet;
const makeCosmoshubPath = ProtoSigning.makeCosmoshubPath;

const GasPrice = require('@cosmjs/stargate').GasPrice;
const calculateFee = require('@cosmjs/stargate').calculateFee;

const SigningCosmWasmClient = require('@cosmjs/cosmwasm-stargate').SigningCosmWasmClient;
const axios = require('axios');
const fs = require('fs');

const loadConfig = (filename) => {
    if(!filename) {
        return LOCAL_SERENITY_TESTNET;
    }

    return JSON.parse(fs.readFileSync(filename, 'utf8'));
}

// generate HD wallet
async function generateWalletThenSaveToFile(filename, password) {
    const wallet = await DirectSecp256k1HdWallet.generate(12, {hdPaths: [makeCosmoshubPath(0)], prefix: 'aura'});
    const encryptedWallet = await wallet.serialize(password);
    fs.writeFileSync(`${filename}`, encryptedWallet, 'utf8');
    return wallet;
};

const loadWalletFromFile = async (filename, password) => {
    const wallet = await DirectSecp256k1HdWallet.deserialize(fs.readFileSync(`${filename}`, 'utf8'), password);
    return wallet;
};

// ask for tokens
const hitFaucet = async (config, address) => {
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
};

const DEFAULT_OPTIONS = {
    rpcURL: 'http://localhost:26657', // testnet RPC endpoints: 'https://rpc.serenity.aura.network:443',
    chainId: 'serenity-testnet',

    hdPath: makeCosmoshubPath(0),
    addressPrefix: 'aura',
    feeToken: 'uaura',

    faucetUrl: 'http://localhost:4500',
    faucetAmount: '100000000000uaura',

    uploadFee: 10000000,
    gasPrice: "0.025uaura",
    
    walletFilePath: 'walletFilePath',   // TODO sync with account module
    walletFilePassword: "password",     // TODO sync with account module
    wasmFilePath: process.cwd(), // absolute path to wasm file
}

// get / create account, faucet if balance is zero, create signing client
const setup = async (options) => {
    // create / load wallet
    let wallet;
    console.log("Loading wallet ...");
    try {
        wallet = await loadWalletFromFile(options.walletFilePath, options.walletFilePassword);
    } catch(err) {
        wallet = await generateWalletThenSaveToFile(options.walletFilePath, options.walletFilePassword);
    }
    const address = (await wallet.getAccounts())[0].address;
    const client = await SigningCosmWasmClient.connectWithSigner(options.rpcURL, wallet, { prefix: options.addressPrefix, gasPrice: options.gasPrice });

    // faucet: get sufficient balance to perform upload
    let currentBalance = await client.getBalance(address, options.feeToken);
    if(options.faucetUrl && (currentBalance.amount == 0 || currentBalance.amount < 1000000)) {
        console.log("Balance is zero, asking for some tokens ...");
        await hitFaucet(options, address);
        currentBalance = await client.getBalance(address, options.feeToken);
        console.log(`current balance address "${address}": ${currentBalance.amount}${currentBalance.denom}`);
    }

    return [address, client];
}

// deploy smart contract
const deploy = async (options) => {
    options = {...DEFAULT_OPTIONS, ...options}

    const [address, client] = await setup(options);

    // create client and upload contract
    console.log("Deploying wallet ...");
    const wasmFile = fs.readFileSync(options.wasmFilePath);
    const result = await client.upload(address, wasmFile, calculateFee(options.uploadFee, options.gasPrice));
    console.log(`Deploy sucess:\n${JSON.stringify(result, 0, 2)}`);
};

module.exports = deploy;
    