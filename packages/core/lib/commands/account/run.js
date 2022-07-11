const account = require("../../../../account")

module.exports = async function (options) {
  let pair = await account.mnemonic.generateAccount();
  await account.config.saveKey(pair);
};
