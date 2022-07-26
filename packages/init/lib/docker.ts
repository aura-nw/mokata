import Dockerode from "dockerode";

export async function dockerInit() {
  const dockerApi = new Dockerode({
    host: "127.0.0.1",
    port: process.env.DOCKER_PORT || 2375,
  });

  //Pull aurad docker image
  await dockerApi.pull("ghcr.io/aura-nw/aura/serenity/devnet:1.0");

  //Create container
  let container = await dockerApi.createContainer(
    {
      Image: "ghcr.io/aura-nw/aura/serenity/devnet:1.0",
      HostConfig: {
        PortBindings: {
          "26657/tcp": [{ HostPort: "26657" }],
          "1317/tcp": [{ HostPort: "1317" }],
          "4500/tcp": [{ HostPort: "4500" }]
        },
      },
      ExposedPorts: {
        "26657/tcp": {},
        "1317/tcp": {},
        "4500/tcp": {},
      },
      name: "devnet-container"
    }
  );

  await container.start();
}
