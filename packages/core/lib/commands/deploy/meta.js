module.exports = {
  command: "deploy",
  description: "Deploy smart contract",
  builder: {
    wallet: {
      describe: "Path to file storing information of wallet",
      type: "string",
      default: "wallet"
    },
    rpc: {
      describe: "URL to RPC endpoints",
      type: "string",
      default: "http://localhost:26657", // 'https://rpc.serenity.aura.network:443'
    },
    addressPrefix: {
      describe: "address prefix",
      type: "string",
      default: "aura",
    },
    token: {
      describe: "Token for calculating fee",
      type: "string",
      default: "uaura",
    },
    gasPrice: {
      describe: "Gas price",
      type: "string",
      default: "0.025uaura",
    },
    wasm: {
      describe: "Path to wasm file",
      type: "string",
      default: null,
    },
    uploadFee: {
      describe: "Fee for loading smart contract",
      type: "number",
      default: 10000000,
    }
  },
  help: {
    usage: "mokata deploy [--type] [--directory]",
    options: [
      {
        option: "--type <type>",
        description:
          "Method building smart contract, eg: method \"cosmwasm/rust-optimizer:0.12.6\" using docker image named cosmwasm/rust-optimizer:0.12.6 to build smart contract"
      },
      {
        option: "--directory <path>",
        description:
          "Directory storing Smart contract , default is current directory."
      }
    ],
    allowedGlobalOptions: []
  }
};
