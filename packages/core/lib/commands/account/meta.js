module.exports = {
  command: "account",
  description: "Generate account",
  builder: {
    ls: {
      describe: "Get list all account",
      type: "boolean"
    },
    generate: {
      describe: "Generate account",
      type: "boolean",
      default: false
    },
    getBalance: {
      describe: "get balance",
      type: "boolean",
      default: false
    },
    wallet: {
      describe: "path to wallet",
      type: "string",
      default: "wallet"
    }
  },
  help: {
    usage: "mokata account [--generate||-g] [--ls]",
    options: [
      {
        option: "--ls",
        description:
          "Get list account."
      },
      {
        option: "--generate|-g",
        description:
          "Generate account"
      }
    ],
    allowedGlobalOptions: []
  }
};
