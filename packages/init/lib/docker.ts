import Docker from "dockerode";
import { execSync } from 'child_process';

export async function dockerInit() {
  const docker = new Docker({socketPath: '/var/run/docker.sock'});
  const dockerImageName = 'ghcr.io/aura-nw/aura/serenity/devnet:1.0';

  // execSync(`docker pull ${dockerImageName}`, {stdio: 'inherit'});
  execSync(`docker run -d -p 26657:26657 -p 1317:1317 -p 4500:4500 --name aura-devnet ghcr.io/aura-nw/aura/serenity/devnet:1.0`, {stdio: 'inherit'});
}
