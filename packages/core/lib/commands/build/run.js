/* eslint-disable @typescript-eslint/no-var-requires */
const Build = require('build');
const build = Build.build;
const buildWithOptimizer = Build.buildWithOptimizer;
const process = require('process');

const DEFAULT_BULD_OPTIONS = {
  dockerOptions: {socketPath: '/var/run/docker.sock'},
  dockerImageName: 'rust:1.62.0', // 'cosmwasm/rust-optimizer:0.12.6', 
  smartContractDirectory: process.cwd(),
}

module.exports = async function (options) {
  let buildOptions = DEFAULT_BULD_OPTIONS;

  if (options.type) { buildOptions.dockerImageName = options.type; }
  if (options.directory) { buildOptions.smartContractDirectory = options.directory; }
  
  if(buildOptions.dockerImageName.startsWith("cosmwasm/rust-optimizer")) {
    await buildWithOptimizer(buildOptions);
  } else {
    await build(buildOptions);
  }
}
