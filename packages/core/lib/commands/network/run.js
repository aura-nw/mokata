const network = require("network")

module.exports = async function (options) {
  await network.network.generateNetwork();
};
