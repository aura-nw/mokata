'use strict';

const schema = require('..');

describe('Create schema', function() {
    it('test create schema', function() {
        schema.createSchema({
            optionName: 'rust',
            dockerOptions: {socketPath: '/var/run/docker.sock'},
            dockerImageName: 'rust',
            smartContractDirectory: '/home/hunglv46/projects/flower-store-contract',
        });
    });

    it('test create schema specify 1 option', function() {
        schema.createSchema({smartContractDirectory: '/home/hunglv46/projects/flower-store-contract'});
    });
});
