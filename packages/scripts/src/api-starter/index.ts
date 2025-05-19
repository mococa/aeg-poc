/* ---------- External ---------- */
import { ChildProcess, spawn } from "child_process";
import Listr from "listr";
import { bold, yellow, cyan, magenta, red, green } from "chalk";

const services = [
  {
    name: `[${yellow("Service")}] Posts service`,
    command: "yarn workspace @aeg-poc/posts-service dev",
    trigger: "ready",
  },
  {
    name: `[${yellow("Service")}] Users service`,
    command: "yarn workspace @aeg-poc/users-service dev",
    trigger: "ready",
  },
  {
    name: `[${yellow("Service")}] Comments service`,
    command: "yarn workspace @aeg-poc/comments-service dev",
    type: "service",
    trigger: "ready",
  },
  {
    name: `[${yellow("Service")}] Categories service`,
    command: "yarn workspace @aeg-poc/categories-service dev",
    type: "service",
    trigger: "ready",
  },
];

const database = [
  {
    name: `[${magenta("DB")}] Database`,
    command: "yarn workspace @aeg-poc/database start",
    trigger: "skipping initialization",
  },
];

const gateways = [
  {
    name: `[${cyan("Gateway")}] Api Gateway`,
    command: "yarn workspace @aeg-poc/api-gateway dev",
    trigger: "ready",
  },
];

export class ApiStarter {
  constructor() {
    let ready = false;

    const messages = {
      start: bold("Starting dev environment... 🚀"),
      done: bold.green("All apps, services and gateways are running and ready! ✅"),
      cancel: yellow("\nGracefully stopping services..."),
      error: (error: [string, string]) => red(error.join("\n")),
    };

    const processes: ChildProcess[] = [];

    async function waitForReady(proc: ChildProcess, trigger): Promise<void> {
      return new Promise((resolve, reject) => {
        proc.stdout?.on("data", (data: Buffer) => {
          const line = data.toString();
          if (line.toLowerCase().includes(trigger)) {
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
      processes.map(
        (task): Listr.ListrTask => ({
          title: task.name,
          task: async (ctx, t) => {
            const child = spawn(task.command, {
              cwd: "../..",
              shell: true,
              windowsHide: true,
            });

            let buffer: string[] = [];

            child.stdout.on("data", (data) => {
              const text = data.toString();
              if (ready) process.stdout.write(`${task.name} - ${text}`);
              buffer.push(`[${task.name}] ${text}`);
            });

            child.stderr.on("data", (data) => {
              const text = data.toString();
              buffer.push(`[${task.name} ERROR] ${text}`);
            });

            processes.push(child);

            await waitForReady(child, task.trigger);
            t.title = `${task.name} ${green("[READY ✅]")}`;
          },
        }),
      );

    async function main() {
      console.clear();
      console.log(messages.start);

      try {
        await new Listr(tasks(database), {
          concurrent: false,
          exitOnError: true,
          // @ts-ignore
          collapse: false,
        }).run();

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

        ready = true;

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
  }
}
