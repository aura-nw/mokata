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
    console.log(options);

    // Example of similar docker command:
    //     docker run --rm \
    //         --mount type=bind,source="$(pwd)",target=/code \
    //         --mount type=bind,source="$(pwd)/target",target=/code/target \
    //         --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
    //         cosmwasm/rust-optimizer:0.12.6
    docker.run(options.dockerImageName, [], process.stdout, {
            "Volumes": {
                "registry_cache": { }
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
                return console.error(`error: ${err}`);
            }
            console.log(`status code: ${data}`);
    });
    
    console.log('build done');
}

const DEFAULT_CREATE_SCHEMA_OPTIONS = {
    optionName: 'rust',
    dockerOptions: {socketPath: '/var/run/docker.sock'},
    dockerImageName: 'rust', 
    smartContractDirectory: process.cwd(),
}

// create schema using docker image: rust
const createSchema = function(options) {
    options = {...DEFAULT_CREATE_SCHEMA_OPTIONS, ...options};
    const docker = new Docker(options.dockerOptions);

    // Example of similar docker command:
    //     docker run -v '$PWD:/code' -w='/code' --entrypoint /bin/bash rust -c 'cargo schema'
    docker.run(options.dockerImageName, ['-c', 'cargo schema'], process.stdout, {
        'Hostconfig': {
            'autoRemove': true,
            'Binds': [`${options.smartContractDirectory}:/code`],
        },
        "WorkingDir": "/code",
        "Entrypoint": "/bin/bash"
    },
    function(err, data, container) {
        if (err){
            return console.error(err);
        }
        console.log(data.StatusCode);
    });
}

module.exports = {
    build, createSchema
};
