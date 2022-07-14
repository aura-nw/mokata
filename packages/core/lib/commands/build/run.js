const build = require("build").build;

module.exports = async function (options) {
  let buildOptions = {};

  if (options.buildType) {
    buildOptions.dockerImageName = options.buildType;
  }
  
  if (options.directory) {
    buildOptions.smartContractDirectory = options.directory;
  }

  build(buildOptions);
};
