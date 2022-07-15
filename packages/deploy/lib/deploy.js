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
    rpcURL: 'http://localhost:26657', // 'https://rpc.serenity.aura.network:443',
    chainId: 'serenity-testnet',

    hdPath: makeCosmoshubPath(0),
    addressPrefix: 'aura',
    feeToken: 'uaura',

    faucetUrl: 'http://localhost:4500',
    faucetAmount: '100000000000uaura',

    uploadFee: 10000000,
    gasPrice: "0.025uaura",
    
    walletFilePath: 'walletFilePath',   // TODO
    walletFilePassword: "password",     // TODO
    wasmFilePath: `/home/hunglv46/projects/flower-store-contract/target/wasm32-unknown-unknown/release/flower_store.wasm`, // TODO
}

// get / create account, faucet if balance is zero, create signing client
const setup = async (options) => {
    // create / load wallet
    let wallet;
    try {
        wallet = await loadWalletFromFile(options.walletFilePath, options.walletFilePassword);
    } catch(err) {
        wallet = await generateWalletThenSaveToFile(options.walletFilePath, options.walletFilePassword);
    }
    const address = (await wallet.getAccounts())[0].address;
    const client = await SigningCosmWasmClient.connectWithSigner(options.rpcURL, wallet, { prefix: options.addressPrefix, gasPrice: options.gasPrice });

    // faucet
    let currentBalance = await client.getBalance(address, options.feeToken);
    if(options.faucetUrl && (currentBalance.amount == 0 || currentBalance.amount < 1000000)) {
        console.log("Balance is zero, asking for some tokens ...");
        await hitFaucet(options, address);
        let currentBalance = await client.getBalance(address, options.feeToken);
        console.log(`current balance address "${address}": ${currentBalance.amount}${currentBalance.denom}`);
    }

    return [address, client];
}

// deploy smart contract
const deploy = async (options) => {
    options = {...DEFAULT_OPTIONS, ...options}

    console.log(`deploy options: ${JSON.stringify(options, 0, 2)}`);

    const [address, client] = await setup(options);

    // create client and upload contract
    const wasmFile = fs.readFileSync(options.wasmFilePath);
    const result = await client.upload(address, wasmFile, calculateFee(options.uploadFee, options.gasPrice));
    console.log(result);
};

deploy();

module.exports = deploy;


    // console.log('\nGet contract ...');
    // const contracts = await client.getContracts(codeId);
    // console.log(contracts);

    // console.log('\nInitializing smart contract ...');
    // const codeId = result.codeId;
    // const instantiateMsg = {"name":"init-flower","amount":0,"price":0};
    // const instatiateLabel = 'flower-contract';
    // const instantiateResponse = await client.instantiate(address, codeId, instantiateMsg, instatiateLabel, 
    //     calculateFee(options.initFee, options.gasPrice) /** upload fee */);
    // console.log(instantiateResponse);

    // // add new flower
    // console.log('\nAdd new flower to deployed contract ...');
    // const addnewMessage = {"add_new":{"id":"f1","name":"rose","amount":150,"price":100}};
    // const addNewFee = calculateFee(envConfig.initFee, envConfig.gasPrice);
    // const addNewFeeResponse = await client.execute(address, instantiateResponse.contractAddress, addnewMessage, addNewFee);
    // console.log(addNewFeeResponse);

    // // sell flower
    // console.log('\nsell flower ...');
    // const sellMessage = {"sell":{"id":"f1", "amount":1}};
    // const sellFee = calculateFee(envConfig.execFee, envConfig.gasPrice);
    // const sellResponse = await client.execute(address, instantiateResponse.contractAddress, sellMessage, sellFee);
    // console.log(sellResponse);

    // // get contracts
    // console.log('\nGet contract ...');
    // const queryMessage = {"get_flower":{"id":"f1"}};
    // const queryResponse = await client.queryContractSmart(instantiateResponse.contractAddress, queryMessage)
    // console.log(queryResponse)
    // //It should match your wallet address
    // console.log(address);
    