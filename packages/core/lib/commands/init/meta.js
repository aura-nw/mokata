module.exports = {
  command: "init",
  description: "Init env",
  builder: {},
  help: {
    usage: "mokata init [--force]",
    options: [
      {
        option: "--force",
        description:
          "Initialize env json file"
      }
    ],
    allowedGlobalOptions: []
  }
};
