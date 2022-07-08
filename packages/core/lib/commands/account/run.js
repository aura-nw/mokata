const account = require("../../../../account")

module.exports = async function (options) {
  let result = await account.generateAccount();
  console.log(result);
};
