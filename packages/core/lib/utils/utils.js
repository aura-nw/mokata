// Extracts the input flags --option from the arguments  of type `--option=value` or `--option value` or `--flag`
const extractFlags = inputArguments => {
  // Get all the args that begins with `--`. This also includes `--option=value`
  const inputFlags = inputArguments.filter(flag => {
    return flag.startsWith("--") ? flag : null;
  });

  // Extract only the flags i.e `--option` from `--option=value`
  inputFlags.map((flag, i) => {
    let indexOfEqualsSign = flag.indexOf("=");
    if (indexOfEqualsSign > 0) {
      flag = flag.slice(0, indexOfEqualsSign);
      inputFlags.splice(i, 1, flag);
    }
  });
  return inputFlags;
};

const detectConfigOrDefault = options => {
  const Config = require("@truffle/config");

  try {
    return Config.detect(options);
  } catch (error) {
    // Suppress error when truffle can't find a config
    if (error.message === "Could not find suitable configuration file.") {
      return Config.default();
    } else {
      throw error;
    }
  }
};

const convertToAbsolutePath = (path, ...pathSegments) => {
  const { existsSync } = require("fs");
  const { isAbsolute, resolve } = require("path");

  const absolutePath = isAbsolute(path) ? path : resolve(...pathSegments, path);
  
  if(!existsSync(absolutePath)) {
    throw new Error(`Path "${absolutePath}" does not exist.`);
  }

  return absolutePath;
}

module.exports = { extractFlags, detectConfigOrDefault, convertToAbsolutePath };
