const deploy = require("deploy");
const path = require('path');

module.exports = async function (options) {
  let deployOptions = {};
  
  if (options.wallet) { 
    deployOptions.walletFilePath = path.isAbsolute(options.wallet)? options.wallet : path.join(process.cwd(), options.wallet);
  }
  if (options.rpc) { deployOptions.rpcURL = options.rpc; }
  if (options.addressPrefix) { deployOptions.addressPrefix = options.addressPrefix; }
  if (options.token) { deployOptions.feeToken = options.token; }
  if (options.gasPrice) { deployOptions.gasPrice = options.gasPrice; }
  if (options.wasm) { 
    deployOptions.wasmFilePath = path.isAbsolute(options.wasm)? options.wasm : path.join(process.cwd(), '/target/wasm32-unknown-unknown/release', options.wasm);
  }
  if (options.uploadFee) { deployOptions.uploadFee = options.uploadFee; }

  await deploy(deployOptions);
};
