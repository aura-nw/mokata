'use strict';

import Docker from 'dockerode';
import { execSync } from 'child_process';

async function build (options: { dockerOptions: Docker.DockerOptions | undefined; dockerImageName: string; smartContractDirectory: string; }) {
    const docker = new Docker(options.dockerOptions);
    
    // TODO find a way to auto pull docker image when perform docker run 
    // (like --pull="missing" option when using command line)
    execSync(`docker pull ${options.dockerImageName}`, {stdio: 'inherit'});

    // Example of similar docker command:
    //     docker run -v '$PWD:/code' -w='/code' --entrypoint /bin/bash rust -c 'cargo schema'
    const buildWithSchemaCmd = 'rustup target add wasm32-unknown-unknown && RUSTFLAGS="-C link-arg=-s" cargo wasm && cargo schema';
    console.log(options.smartContractDirectory);
    await docker.run(options.dockerImageName, ['-c', buildWithSchemaCmd], process.stdout, {
        "WorkingDir": "/code",
        "Entrypoint": "/bin/bash",
        'Hostconfig': {
            'autoRemove': true,
            'Binds': [`${options.smartContractDirectory}:/code`],
        },
    }).then(response => console.log(response[0].StatusCode));
}

// build smart contract using docker image: cosmwasm/rust-optimizer
async function buildWithOptimizer(options: { dockerOptions: Docker.DockerOptions | undefined; dockerImageName: string; smartContractDirectory: string; }) {
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
            'autoRemove': true,
            'Binds': [`${options.smartContractDirectory}:/code`, 
                `${options.smartContractDirectory}/target:/code/target`, 
                'registry_cache:/usr/local/cargo/registry'],
        },
    }).then(response => console.log(response[0].StatusCode));
}

export { build, buildWithOptimizer };
