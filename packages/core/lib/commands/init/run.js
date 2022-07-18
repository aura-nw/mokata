const config = require("init");
const account = require("account");

module.exports = async function (options) {
    let initConfig = new config.InitConfig();
    await initConfig.init();
    let pair = await account.generateAccount();
    await account.saveKey(pair);
    await account.faucetFile();
};
