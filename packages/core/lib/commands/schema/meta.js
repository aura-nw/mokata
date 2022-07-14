module.exports = {
  command: "schema",
  description: "Create smart contract schema",
  builder: {
    type: {
      describe: "Method to create smart contract schema",
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
    usage: "mokata schema [--type||-t] [--directory||-d]",
    options: [
      {
        option: "--type <type>",
        description:
          "Method building smart contract schema, eg: method \"rust:1.13\" using docker image named rust:1.13 to build smart contract shema"
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
