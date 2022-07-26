'use strict';

var Docker = require("dockerode");

export async function generateNetwork() {
  // TODO
  var docker = new Docker({
    host: "127.0.0.1",
    port: process.env.DOCKER_PORT || 2375,
    version: "v1.25" // required when Docker >= v1.13
  });

  
}
