/* ---------- External ---------- */
import { ChildProcess, exec } from "child_process";
import Listr from "listr";
import { bold, yellow, cyan, red, green } from "chalk";
import { createReadStream } from "fs";

const services = [
  {
    name: `[${yellow("Service")}] Posts service`,
    command: "yarn workspace @aeg-poc/posts-service serve",
  },
  {
    name: `[${yellow("Service")}] Users service`,
    command: "yarn workspace @aeg-poc/users-service serve",
  },
];

const gateways = [
  {
    name: `[${cyan("Gateway")}] Api Gateway`,
    command: "yarn workspace @aeg-poc/api-gateway dev",
  },
];

const messages = {
  start: bold("Starting dev environment... 🚀"),
  done: bold.green("All services and gateways are running and ready! ✅"),
  cancel: yellow("\nGracefully stopping services..."),
  error: (error: [string, string]) => red(error.join("\n")),
};

const processes: any[] = [];

async function waitForReady(proc: ChildProcess): Promise<void> {
  return new Promise((resolve, reject) => {
    proc.stdout?.on("data", (data: Buffer) => {
      const line = data.toString();
      if (line.toLowerCase().includes("ready")) {
        resolve();
      }
    });
    proc.stderr?.on("data", (data: Buffer) => {
      const line = data.toString();
      if (line.toLowerCase().includes("error")) {
        reject(new Error(line));
      }
    });

    proc.on("error", reject);
    proc.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Process exited with code ${code}`));
    });
  });
}

const tasks = (processes) =>
  processes.map((task): Listr.ListrTask => ({
    title: task.name,
    task: async (ctx, t) => {
      const child = exec(task.command, {
        cwd: "../..",
        windowsHide: true,
      });

      processes.push(child);

      await waitForReady(child);
      t.title = `${task.name} ${green("[READY ✅]")}`;
    },
  }));

async function main() {
  console.clear();
  console.log(messages.start);

  try {
    await new Listr(tasks(services), {
      concurrent: true,
      exitOnError: true,
      // @ts-ignore
      collapse: false,
    }).run();

    await new Listr(tasks(gateways), {
      concurrent: false,
      exitOnError: true,
      // @ts-ignore
      collapse: false,
    }).run();

    console.log(`\n${messages.done}`);
  } catch (error: any) {
    const errors = error.errors?.map(({ shortMessage, stderr }) => [
      shortMessage,
      stderr,
    ]) as [string, string][];
    if (errors) {
      errors.forEach((e) => console.error(messages.error(e)));
    } else {
      console.error(messages.error([error.message, ""]));
    }
    process.exit(1);
  }
}

// Handle Ctrl+C
process.on("SIGINT", () => {
  console.log(messages.cancel);
  for (const child of processes) {
    if (child.kill) {
      child.kill("SIGINT");
    }
  }
  process.exit(0);
});

main();
