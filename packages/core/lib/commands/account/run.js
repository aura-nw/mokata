const account = require("../../../../account")

module.exports = async function (options) {
  let result = await account.mnemonic.generateAccount();
  console.log(result);
};
