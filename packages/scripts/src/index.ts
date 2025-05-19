import { ApiStarter } from "./api-starter";
import { Builder } from "./builder";

const commands = {
  build: () => new Builder(),
  start: () => new ApiStarter(),
};

const command = commands[process.argv[2]];
if (!command) {
  console.error(`Invalid command. Use ${Object.keys(commands).join(", ")}.`);
  process.exit(1);
}

command();
