module.exports = {
    command: "account",
    description: "Generate account",
    builder: {
      "reset": {
        type: "boolean",
        default: false
      },
    },
    help: {
      usage: "mokata account [--force]",
      options: [{
        option: "--reset",
        description:
          "Run all migrations from the beginning, instead of running from the last " +
          "completed migration."
      }],
      allowedGlobalOptions: []
    }
  };
  