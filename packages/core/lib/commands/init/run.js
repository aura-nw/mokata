const config = require("init")

module.exports = async function (options) {
    let initConfig = new config.InitConfig();
    await initConfig.init();
};
