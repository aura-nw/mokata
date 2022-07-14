const createSchema = require("schema");

module.exports = async function (options) {
  let createSchemaOptions = {};

  if (createSchemaOptions.type) {
    createSchemaOptions.dockerImageName = options.type;
  }
  
  if (options.directory) {
    createSchemaOptions.smartContractDirectory = options.directory;
  }

  createSchema(createSchemaOptions);
};
