'use strict';

const build = require('../lib/build');

describe('build and create schema', function() {
    it('test build', function() {
        build.build({
            optionName: 'cosmwasm/rust-optimizer',
            dockerOptions: {socketPath: '/var/run/docker.sock'},
            dockerImageName: 'cosmwasm/rust-optimizer:0.12.6',
            smartContractDirectory: '/home/hunglv46/projects/flower-store-contract',
        });
    });

    it('test build specify 1 option', function() {
        build.build({smartContractDirectory: '/home/hunglv46/projects/flower-store-contract'})
    });
});
