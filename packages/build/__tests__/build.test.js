'use strict';

const build = require('..');

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

    it('test create schema', function() {
        build.createSchema({
            optionName: 'rust',
            dockerOptions: {socketPath: '/var/run/docker.sock'},
            dockerImageName: 'rust',
            smartContractDirectory: '/home/hunglv46/projects/flower-store-contract',
        });
    });

    it('test create schema specify 1 option', function() {
        build.createSchema({smartContractDirectory: '/home/hunglv46/projects/flower-store-contract'});
    });
});
