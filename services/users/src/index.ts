/* ---------- External ---------- */
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startStandaloneServer } from "@apollo/server/standalone";

/* ---------- Utils ---------- */
import { createDataLoaders } from "@aeg-poc/utils";

/* ---------- SDK ---------- */
import { AegSDK } from "@aeg-poc/sdk";

/* ---------- Database ---------- */
import { UsersDatabase, UsersRepository } from "./database";

/* ---------- Schema ---------- */
import { UserSchema } from "./schema";

/* ---------- Constants ---------- */
const port = Number(process.env.PORT ?? 4001);
if (!port) {
  console.error("users PORT is not defined in .env file. Using default port 4001.");
}

/**
 * @description
 * This is the main entry point for the User service.
 * It creates an instance of ApolloServer and sets up the server to listen on port 4001.
 */
async function startServer() {
  const database = new UsersDatabase();
  await database.createTables();

  const repository = new UsersRepository(database);
  const { schema } = new UserSchema(repository);

  const server = new ApolloServer({
    schema: buildSubgraphSchema([schema]),
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({}) => ({
      dataloaders: createDataLoaders(new AegSDK()),
    }),
    listen: { port },
  });

  console.log(`🚀 Users service ready at ${url}`);
}

startServer();
