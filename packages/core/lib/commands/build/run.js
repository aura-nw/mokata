const { build, buildWithOptimizer} = require('build');
const { convertToAbsolutePath } = require('../../utils/utils');

module.exports = async function (options) {
  let buildOptions = {
    dockerOptions: {socketPath: '/var/run/docker.sock'},
    dockerImageName: options.type,
    smartContractDirectory: convertToAbsolutePath(options.directory)
  }
  
  if(buildOptions.dockerImageName.startsWith("cosmwasm/rust-optimizer")) {
    await buildWithOptimizer(buildOptions);
  } else {
    await build(buildOptions);
  }
}
