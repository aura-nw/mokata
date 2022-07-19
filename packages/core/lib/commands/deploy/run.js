/* eslint-disable @typescript-eslint/no-var-requires */
const Deploy = require('deploy');
const setup = Deploy.setup;
const deploy = Deploy.deploy;

const path = require('path');
const isAbsolute = path.isAbsolute;
const join = path.join;

const makeCosmoshubPath = require('@cosmjs/proto-signing').makeCosmoshubPath;
const process = require('process');

module.exports = async function (options) {
  const deployOptions = convertCmdOptionsToBuildOptions(options);

  const [address, client] = await setup(deployOptions);
  await deploy(client, address, deployOptions.wasmFilePath, deployOptions.uploadFee);
}

const DEFAULT_OPTIONS = {
  rpcURL: 'http://localhost:26657', // testnet RPC endpoints: 'https://rpc.serenity.aura.network:443',
  chainId: 'serenity-testnet',

  hdPath: makeCosmoshubPath(0),
  addressPrefix: 'aura',
  feeToken: 'uaura',

  // faucetUrl: 'http://localhost:4500',
  faucetAmount: '100000000000uaura',

  uploadFee: 10000000,
  gasPrice: "0.025uaura",
  
  walletFilePath: 'walletFilePath',
  walletFilePassword: "password",     // TODO sync with account module
  wasmFilePath: process.cwd(), // absolute path to wasm file
}

function convertCmdOptionsToBuildOptions(cmdOption) {
  let deployOptions = DEFAULT_OPTIONS;

  if (cmdOption.wallet) {
      deployOptions.walletFilePath = isAbsolute(cmdOption.wallet)
        ? cmdOption.wallet 
        : join(process.cwd(), cmdOption.wallet);
  }
  if (cmdOption.rpc) { deployOptions.rpcURL = cmdOption.rpc; }
  if (cmdOption.addressPrefix) { deployOptions.addressPrefix = cmdOption.addressPrefix; }
  if (cmdOption.token) { deployOptions.feeToken = cmdOption.token; }
  if (cmdOption.gasPrice) { deployOptions.gasPrice = cmdOption.gasPrice; }
  if (cmdOption.wasm) {
    deployOptions.wasmFilePath = isAbsolute(cmdOption.wasm)
      ? cmdOption.wasm 
      : join(process.cwd(), '/target/wasm32-unknown-unknown/release', cmdOption.wasm);
  }
  deployOptions.uploadFee = cmdOption.uploadFee ? cmdOption.uploadFee : 'auto';

  return deployOptions;
}
