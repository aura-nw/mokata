'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = exports.setup = void 0;
// this file is written based on the following file: https://raw.githubusercontent.com/InterWasm/cw-plus-helpers/main/base.ts
const proto_signing_1 = require("@cosmjs/proto-signing");
const cosmwasm_stargate_1 = require("@cosmjs/cosmwasm-stargate");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
// generate HD wallet
function generateWalletThenSaveToFile(filename, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield proto_signing_1.DirectSecp256k1HdWallet.generate(12, { hdPaths: [(0, proto_signing_1.makeCosmoshubPath)(0)], prefix: 'aura' });
        const encryptedWallet = yield wallet.serialize(password);
        fs_1.default.writeFileSync(`${filename}`, encryptedWallet, 'utf8');
        return wallet;
    });
}
function loadWalletFromFile(filename, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield proto_signing_1.DirectSecp256k1HdWallet.deserialize(fs_1.default.readFileSync(`${filename}`, 'utf8'), password);
        return wallet;
    });
}
// ask for tokens
function hitFaucet(config, address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(config.faucetUrl, {
                address: address,
                coins: [config.faucetAmount]
            });
            console.log(response.data);
        }
        catch (err) {
            console.log("Unable to ask for token, please check if your faucet URL, wallet address and faucet Amount.");
            throw err;
        }
    });
}
// get / create account, faucet if balance is zero, create signing client
function setup(options) {
    return __awaiter(this, void 0, void 0, function* () {
        // create / load wallet
        let wallet;
        console.log("Loading wallet ...");
        try {
            wallet = yield loadWalletFromFile(options.walletFilePath, options.walletFilePassword);
        }
        catch (err) {
            wallet = yield generateWalletThenSaveToFile(options.walletFilePath, options.walletFilePassword);
        }
        const address = (yield wallet.getAccounts())[0].address;
        const client = yield cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(options.rpcURL, wallet, { prefix: options.addressPrefix, gasPrice: options.gasPrice });
        // faucet: get sufficient balance to perform upload
        if (options.faucetUrl) {
            yield hitFaucet(options, address);
            const currentBalance = yield client.getBalance(address, options.feeToken);
            console.log(`current balance address "${address}": ${currentBalance.amount}${currentBalance.denom}`);
        }
        return [address, client];
    });
}
exports.setup = setup;
// deploy smart contract
function deploy(client, walletAddress, wasmFilePath, uploadFee) {
    return __awaiter(this, void 0, void 0, function* () {
        // create client and upload contract
        console.log("Deploying wallet ...");
        const wasmFile = fs_1.default.readFileSync(wasmFilePath);
        const result = yield client.upload(walletAddress, wasmFile, uploadFee);
        console.log(`Deploy sucess:\n${JSON.stringify(result, null, 2)}`);
    });
}
exports.deploy = deploy;
