const account = require("account");

module.exports = async function (options) {
  if (options.generate == true) {
    let pair = await account.generateAccount();
    await account.saveKey(pair);
  }

  if (options.ls == true){
    return await account.listAccount();
  }

  await account.faucetFile();
};
