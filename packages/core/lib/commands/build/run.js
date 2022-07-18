const build = require("build").build;
const buildWithOptimizer = require("build").buildWithOptimizer;

module.exports = async function (options) {
  let buildOptions = {};
  
  if (options.type) { buildOptions.dockerImageName = options.type; }
  if (options.directory) { buildOptions.smartContractDirectory = options.directory; }
  
  if(options.type.startsWith("cosmwasm/rust-optimizer")) {
    await buildWithOptimizer(buildOptions);
  } else {
    await build(buildOptions);
  }
};
