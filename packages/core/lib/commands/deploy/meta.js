module.exports = {
  command: "deploy",
  description: "Deploy smart contract",
  builder: {
    wallet: {
      describe: "Path to file storing information of wallet",
      type: "string",
      default: null
    },
    rpc: {
      describe: "URL to RPC endpoints",
      type: "string",
      default: null,
    },
    addressPrefix: {
      describe: "address prefix",
      type: "string",
      default: null,
    },
    token: {
      describe: "Token for calculating fee",
      type: "string",
      default: null,
    },
    gasPrice: {
      describe: "Gas price",
      type: "string",
      default: null,
    },
    wasm: {
      describe: "Path to wasm file",
      type: "string",
      default: null,
    },
    uploadFee: {
      describe: "Fee for loading smart contract",
      type: "string",
      default: null,
    },
  },
  help: {
    usage: "mokata deploy [--type||-t] [--directory||-d]",
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
