'use strict';

const Docker = require('dockerode');
const spawn = require('child_process').spawn;

const DEFAULT_CREATE_SCHEMA_OPTIONS = {
    optionName: 'rust',
    dockerOptions: {socketPath: '/var/run/docker.sock'},
    dockerImageName: 'rust:1.60', 
    smartContractDirectory: process.cwd(),
}

// create schema using docker image: rust
const createSchema = async function(options) {
    options = {...DEFAULT_CREATE_SCHEMA_OPTIONS, ...options};
    const docker = new Docker(options.dockerOptions);
    
    // TODO if image does not pre-exist, Error: (HTTP code 404) no such container - No such image
    
    // Example of similar docker command:
    //     docker run -v '$PWD:/code' -w='/code' --entrypoint /bin/bash rust -c 'cargo schema'
    await docker.run(options.dockerImageName, ['-c', 'cargo schema'], process.stdout, {
        'Hostconfig': {
            'autoRemove': true,
            'Binds': [`${options.smartContractDirectory}:/code`],
        },
        "WorkingDir": "/code",
        "Entrypoint": "/bin/bash"
    }).then(response => console.log(response[0].StatusCode));
}

module.exports = createSchema;
