/* eslint-disable @typescript-eslint/no-var-requires */
const { setup, deploy } = require('deploy');
const { makeCosmoshubPath } = require('@cosmjs/proto-signing');
const { convertToAbsolutePath } = require('../../utils/utils');

module.exports = async function (options) {
  console.log(JSON.stringify(options, 0, 2));

  verifyOptions(options);

  let deployOptions = {
    rpcURL: options.rpc,
    chainId: 'serenity-testnet',
    hdPath: makeCosmoshubPath(0),
    addressPrefix: options.addressPrefix,
    
    feeToken: options.token,
    gasPrice: options.gasPrice,
    
    walletFilePath: options.wallet,
    walletFilePassword: "password",     // TODO sync with account module
    wasmFilePath: convertToAbsolutePath(options.wasm), // target/wasm32-unknown-unknown/release
    uploadFee: options.uploadFee ? options.uploadFee : 'auto'
  };

  console.log(JSON.stringify(deployOptions, 0, 2));
  
  const [address, client] = await setup(deployOptions);
  await deploy(client, address, deployOptions.wasmFilePath, deployOptions.uploadFee);
}

function verifyOptions(options) {
  if(!options.wasm) {
    throw new Error('Path to compiled smart contract must be specified via --wasm flag');
  }
}
