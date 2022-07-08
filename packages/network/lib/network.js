"use strict";

var Docker = require("dockerode");

module.exports = generateNetwork;

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
    if(container.Image.match(/.*serenity.*/))
      return true;
  })
  console.log(checkContainer);

  //If not find aurad image then run container
  //Check aurad image has download or not 
  let listImages = await docker.listImages();
  let checkImage =  listImages.forEach(function(image){
    if(image.RepoTags.includes('serenity'))
      return true
  });

  //Download image if not exist
  
}
