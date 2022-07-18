'use strict';

const Docker = require('dockerode');
const execSync = require('child_process').execSync;

const DEFAULT_BULD_OPTIONS = {
    optionName: 'cosmwasm/rust-optimizer',
    dockerOptions: {socketPath: '/var/run/docker.sock'},
    dockerImageName: 'rust:1.62.0', // 'cosmwasm/rust-optimizer:0.12.6', 
    smartContractDirectory: process.cwd(),
}

const build = async function(options) {
    options = {...DEFAULT_BULD_OPTIONS, ...options};
    const docker = new Docker(options.dockerOptions);
    
    // TODO find a way to auto pull docker image when perform docker run 
    // (like --pull="missing" option when using command line)
    execSync(`docker pull ${options.dockerImageName}`, {stdio: 'inherit'});

    // Example of similar docker command:
    //     docker run -v '$PWD:/code' -w='/code' --entrypoint /bin/bash rust -c 'cargo schema'
    const buildWithSchemaCmd = 'rustup target add wasm32-unknown-unknown && RUSTFLAGS="-C link-arg=-s" cargo wasm && cargo schema';
    await docker.run(options.dockerImageName, ['-c', buildWithSchemaCmd], process.stdout, {
        'Hostconfig': {
            'autoRemove': true,
            'Binds': [`${options.smartContractDirectory}:/code`],
        },
        "WorkingDir": "/code",
        "Entrypoint": "/bin/bash"
    }).then(response => console.log(response[0].StatusCode));
}

// build smart contract using docker image: cosmwasm/rust-optimizer
const buildWithOptimizer = async function(options) {
    options = {...DEFAULT_BULD_OPTIONS, ...options};
    const docker = new Docker(options.dockerOptions);

    // TODO find a way to auto pull docker image when perform docker run 
    // (like --pull="missing" option when using command line)
    execSync(`docker pull ${options.dockerImageName}`, {stdio: 'inherit'});

    // Example of similar docker command:
    //     docker run --rm \
    //         --mount type=bind,source="$(pwd)",target=/code \
    //         --mount type=bind,source="$(pwd)/target",target=/code/target \
    //         --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
    //         cosmwasm/rust-optimizer:0.12.6
    await docker.run(options.dockerImageName, [], process.stdout, {
        'Volumes': {
            'registry_cache': { }
        },
        'Hostconfig': {
            // 'autoRemove': true,
            'Binds': [`${options.smartContractDirectory}:/code`, 
                `${options.smartContractDirectory}/target:/code/target`, 
                'registry_cache:/usr/local/cargo/registry'],
        },
    }).then(response => console.log(response[0].StatusCode));
}

module.exports = { build, buildWithOptimizer };
