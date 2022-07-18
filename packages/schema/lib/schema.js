'use strict';

const Docker = require('dockerode');
const execSync = require('child_process').execSync;

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
    
    // TODO find a way to auto pull docker image when perform docker run 
    // (like --pull="missing" option when using command line)
    execSync(`docker pull ${options.dockerImageName}`, {stdio: 'inherit'});

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
