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
      type: "boolean"
    },
    faucet: {
      describe: "Get faucet to account",
      type: "string"
    }
  },
  help: {
    usage: "mokata account [--generate] [--ls] [--faucet <address>]",
    options: [
      {
        option: "--ls",
        description:
          "Get list account."
      },
      {
        option: "--generate",
        description:
          "Generate account"
      },
      {
        option: "--faucet <address>",
        description:
          "Get faucet to account"
      }
    ],
    allowedGlobalOptions: []
  }
};
