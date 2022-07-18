const account = require("account")

module.exports = async function (options) {
  if (options.generate == true) {
    let pair = await account.mnemonic.generateAccount();
    await account.saveKey(pair);
  }

  await account.faucetFile();
};
