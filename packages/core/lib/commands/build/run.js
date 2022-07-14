const build = require("build");

module.exports = async function (options) {
  let buildOptions = {};
  
  if (options.type) {
    buildOptions.dockerImageName = options.type;
  }
  
  if (options.directory) {
    buildOptions.smartContractDirectory = options.directory;
  }

  console.log(`CMD options:\n${JSON.stringify(buildOptions)}`);
  build(buildOptions);
};
