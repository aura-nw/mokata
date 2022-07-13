'use strict';

var Docker = require("dockerode");

async function generateNetwork() {
  // TODO
  var docker = new Docker({
    host: "127.0.0.1",
    port: process.env.DOCKER_PORT || 2375,
    version: "v1.25" // required when Docker >= v1.13
  });

  //List all containers are running in docker
  let listContainers = await docker.listContainers();
  console.log(listContainers);
  let checkContainer = listContainers.forEach(function(container){
    if(container.Image.match(/.*serenity.*/) == true)
      return true;
  })
  console.log(checkContainer);
}

module.exports = {
  generateNetwork
}
