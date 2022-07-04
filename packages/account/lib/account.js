'use strict';

var bip39 = require('bip39')

module.exports = {
    account,
    generateAccount
};

function account() {
    // TODO
}

function generateAccount(){
    // Generate from mnemonic 
    const mnemonic = bip39.generateMnemonic();
    console.log(mnemonic.toString());
}
