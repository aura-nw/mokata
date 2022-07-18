module.exports = {
  command: "build",
  description: "Build smart contract",
  builder: {
    type: {
      describe: "Method to build smart contract",
      type: "string",
      default: false,
    },
    directory: {
      describe: "Directory contains smart contract",
      type: "string",
      default: false,
    },

  },
  help: {
    usage: "mokata build [--type] [--directory]",
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
