import Dockerode from "dockerode";
import * as axios from "axios";

export async function dockerInit() {
  const dockerApi = new Dockerode({
    host: "172.29.21.190",
    port: process.env.DOCKER_PORT || 2375,
    version: 'v1.25' // required when Docker >= v1.13,
  });

  let checkDockerApi = await dockerApi.ping();
  console.log(checkDockerApi);
}
