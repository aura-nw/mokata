'use strict';

const Docker = require('dockerode');

const DEFAULT_CREATE_SCHEMA_OPTIONS = {
    optionName: 'rust',
    dockerOptions: {socketPath: '/var/run/docker.sock'},
    dockerImageName: 'rust:1.62.0', 
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

module.exports = createSchema;
