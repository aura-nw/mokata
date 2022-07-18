const config = require("init");
const account = require("account");


module.exports = async function (options) {
    let initConfig = new config.InitConfig();
    await initConfig.init();
    let pair = await account.mnemonic.generateAccount();
    await account.config.saveKey(pair);
};
