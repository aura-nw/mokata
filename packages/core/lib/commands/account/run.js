const account = require("account")

module.exports = async function (options) {
  if (options.generate == true) {
    let pair = await account.mnemonic.generateAccount();
    await account.config.saveKey(pair);
  }

  if(options.ls == true){
    console.log('List account');
  }
};
