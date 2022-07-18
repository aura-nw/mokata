const account = require("account");

module.exports = async function (options) {
  if (options.generate == true) {
    let pair = await account.generateAccount();
    await account.saveKey(pair);
  }

  if (options.ls == true) {
    await account.listAccount();
  }

  if (options.faucet && options.faucet.length > 0){
    await account.faucetAddress(options.faucet)
  }
}
