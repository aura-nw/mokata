const account = require("account");

module.exports = async function (options) {
  let walletPath = options.wallet;
  let walletPassword = "password";
  let address;
  if (options.generate) {
    [wallet, address] = await account.config.generateWalletThenSaveToFile(walletPath, walletPassword);
    console.log(`Generated Account: ${address}`);

    const faucetAmount = "1000000000000uaura";
    console.log(`Faucet \n\tURL: "http://localhost:4500", \n\tamount: ${faucetAmount}, \n\taddress: ${address}`);
    await account.config.hitFaucet("http://localhost:4500", faucetAmount, address);
  }

  if (options.getBalance) {
    account.config.getBalance(walletPath, walletPassword);
  }

  if((!options.generate && !options.getBalance) || options.ls == true){
    console.log('List account');
  }
};
