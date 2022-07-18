import * as amino from "@cosmjs/amino";
import * as bip39 from "bip39";

export async function generateAccount() {
  // Generate from mnemonic
  let mnemonic = bip39.generateMnemonic();
  let privateKey = await amino.Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "aura"
  });
  let privateResult = await privateKey.getAccounts();

  let pubkeys = amino.encodeSecp256k1Pubkey(privateResult[0].pubkey);
  let address = privateResult[0].address;


  let result = {
    PrivateKey: await privateKey.serialize('password'),
    Address: address
  };

  return result;
}