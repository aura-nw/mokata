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
