/* ---------- External ---------- */
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";

/* ---------- Utils ---------- */
import { createDataLoaders } from "@aeg-poc/utils";

/* ---------- SDK ---------- */
import { AegSDK } from "@aeg-poc/sdk";

/* ---------- Database ---------- */
import { PostsDatabase, PostsRepository } from "./database";

/* ---------- Schema ---------- */
import { PostSchema } from "./schema";

/* ---------- Constants ---------- */
const port = Number(process.env.PORT ?? 4002);
if (!port) {
  console.error("posts PORT is not defined in .env file. Using default port 4002.");
}

/**
 * @description
 * This is the main entry point for the Posts service.
 * It creates an instance of ApolloServer and sets up the server to listen on port 4002.
 */
async function startServer() {
  const database = new PostsDatabase();
  await database.createTables();

  const repository = new PostsRepository(database);
  const { schema } = new PostSchema(repository);

  const server = new ApolloServer({
    schema: buildSubgraphSchema([schema]),
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({}) => ({
      dataloaders: createDataLoaders(new AegSDK()),
    }),
    listen: { port },
  });

  console.log(`🚀 Posts service ready at ${url}`);
}

startServer();
