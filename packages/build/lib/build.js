'use strict';

const Docker = require('dockerode');

const DEFAULT_BULD_OPTIONS = {
    optionName: 'cosmwasm/rust-optimizer',
    dockerOptions: {socketPath: '/var/run/docker.sock'},
    dockerImageName: 'cosmwasm/rust-optimizer:0.12.6', 
    smartContractDirectory: process.cwd(),
}

// build smart contract using docker image: cosmwasm/rust-optimizer
const build = function(options) {
    options = {...DEFAULT_BULD_OPTIONS, ...options};
    const docker = new Docker(options.dockerOptions);

    // Example of similar docker command:
    //     docker run --rm \
    //         --mount type=bind,source="$(pwd)",target=/code \
    //         --mount type=bind,source="$(pwd)/target",target=/code/target \
    //         --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
    //         cosmwasm/rust-optimizer:0.12.6
    docker.run(options.dockerImageName, [], process.stdout, {
            'Volumes': {
                'registry_cache': { }
            },
            'Hostconfig': {
                'autoRemove': true,
                'Binds': [`${options.smartContractDirectory}:/code`, 
                    `${options.smartContractDirectory}/target:/code/target`, 
                    'registry_cache:/usr/local/cargo/registry'],
            },
        },
        function(err, data, container) {
            if (err){
                return console.error(err);
            }
            console.log(data.StatusCode);
    });
}

module.exports = build;
