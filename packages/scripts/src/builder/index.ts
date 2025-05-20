/* ---------- External ---------- */
import { command } from "execa";
import Listr from "listr";
import { red, bold, yellow, cyan } from "chalk";

export class Builder {
  constructor() {
    const tasks = [
      {
        name: `[${cyan("App")}] App`,
        command: "yarn workspace @aeg-poc/app build",
        type: "app",
      },
      {
        name: `[${cyan("App")}] Api Gateway`,
        command: "yarn workspace @aeg-poc/api-gateway build",
        type: "app",
      },
      {
        name: `[${yellow("Service")}] Posts service`,
        command: "yarn workspace @aeg-poc/posts-service build",
        type: "service",
      },
      {
        name: `[${yellow("Service")}] Users service`,
        command: "yarn workspace @aeg-poc/users-service build",
        type: "service",
      },
      {
        name: `[${yellow("Service")}] Comments service`,
        command: "yarn workspace @aeg-poc/comments-service build",
        type: "service",
      },
      {
        name: `[${yellow("Service")}] Categories service`,
        command: "yarn workspace @aeg-poc/categories-service build",
        type: "service",
      },
    ];

    const messages = {
      start: bold("Starting build process... 🥁"),
      done: bold.green("All apps have been successfully built! 🎉"),
      cancel: yellow("\nGracefully stopping tasks..."),
      error: (error: [string, string]) => red(error.join("\n")),
    };

    // Track running processes
    const processes = [];

    async function runTask(task) {
      const startTime = Date.now();
      await command(task.command, { cwd: "../.." });
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      return `Done in ${bold(`${duration}s`)}`;
    }

    const runners = [
      { title: "📦 Packages", type: "package" },
      { title: "🛎️  Services", type: "service" },
      { title: "📱 Apps", type: "app" },
    ].map(createRunner);

    async function main() {
      console.clear();
      console.log(messages.start);

      try {
        await new Listr(runners, {
          concurrent: false,
          exitOnError: true,
          // @ts-ignore
          collapse: false,
        }).run();

        console.log(`\n${messages.done}`);
      } catch (error) {
        const errors = error.errors.map(({ shortMessage, stderr }) => [
          shortMessage,
          stderr,
        ]) as [string, string][];

        errors.forEach((e) => console.error(messages.error(e)));
        process.exit(1);
      }
    }

    // Handle Ctrl+C (SIGINT)
    process.on("SIGINT", () => {
      console.log(messages.cancel);
      for (const child of processes) {
        if (child.kill) {
          child.kill("SIGINT");
        }
      }
      process.exit(0);
    });

    main().catch((error) => {
      console.error(messages.error(error));
      process.exit(1);
    });

    /**
     * @description
     * Creates a Listr runner for a given group of tasks.
     *
     * @param group - The group of tasks to create a runner for.
     * @param group.title - The title of the group.
     * @param group.type - The type of the group.
     *
     * @returns {Listr.ListrTask} - The Listr runner for the group.
     */
    function createRunner(group: { title: string; type: string }): Listr.ListrTask {
      return {
        title: group.title,
        task: () => {
          const maxLength = Math.max(...tasks.map((t) => t.type.length + t.name.length));

          return new Listr(
            tasks
              .filter(({ type }) => type === group.type)
              .map(({ name, command }) => ({
                title: name,
                task: async (_, task) => {
                  const result = await runTask({ name, command });
                  const padEnd = name.padEnd(maxLength, " ");
                  const padded = `${padEnd}${
                    maxLength === name.length
                      ? " ".repeat(Math.floor(name.length / 4) - 1)
                      : ""
                  }`;

                  task.title = `${padded} [⏱️  ${result}]`;
                },
              })),
            // @ts-ignore
            { concurrent: true, exitOnError: true, collapse: false },
          );
        },
      };
    }
  }
}
