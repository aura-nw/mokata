const generateNetwork = require("../../../../network");

module.exports = async function (options) {
  let result = await generateNetwork();
  console.log(result);
};
