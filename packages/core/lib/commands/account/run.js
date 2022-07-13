const account = require("../../../../account")

module.exports = async function (options) {
  let pair = await account.mnemonic.generateAccount();
  await account.config.saveKey(pair);

  if (options._ && options._.length > 0) {
    console.log('Option');
  } else {
    console.log('Non option');
  }
};
