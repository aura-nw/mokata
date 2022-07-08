"use strict";

var bip39 = require("bip39");
const stargate = require("@cosmjs/stargate");
const amino = require("@cosmjs/amino");

module.exports = {
  generateAccount
};

async function generateAccount() {
  // Generate from mnemonic
  let mnemonic = bip39.generateMnemonic();
  let privateKey = await amino.Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "aura"
  });
  let pubkeys = amino.encodeSecp256k1Pubkey(await privateKey.getAccounts()[0].pubkey);
  let address = (await wallet.getAccounts())[0].address;

  console.log(pubkeys);
}

