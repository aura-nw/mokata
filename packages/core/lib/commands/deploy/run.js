const deploy = require("deploy");

module.exports = async function (options) {
  let deployOptions = {};
  
  if (options.wallet) { deployOptions.walletFilePath = options.wallet; }
  if (options.rpc) { deployOptions.rpcURL = options.rpc; }
  if (options.addressPrefix) { deployOptions.addressPrefix = options.addressPrefix; }
  if (options.token) { deployOptions.feeToken = options.token; }
  if (options.gasPrice) { deployOptions.gasPrice = options.gasPrice; }
  if (options.wasm) { deployOptions.wasmFilePath = options.wasm; }
  if (options.uploadFee) { deployOptions.uploadFee = options.uploadFee; }

  console.log(`CMD options: ${JSON.stringify(deployOptions, 0, 2)}`);
  await deploy(buildOptions);
};
