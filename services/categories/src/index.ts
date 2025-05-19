/* ---------- External ---------- */
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";

/* ---------- Utils ---------- */
import { createDataLoaders } from "@aeg-poc/utils";

/* ---------- SDK ---------- */
import { AegSDK } from "@aeg-poc/sdk";

/* ---------- Service ---------- */
import { CategoriesDatabase, CategoriesRepository } from "./database";

/* ---------- Schema ---------- */
import { CategorySchema } from "./schema";

/* ---------- Constants ---------- */
const port = Number(process.env.PORT ?? 4004);
if (!port) {
  console.error("categories PORT is not defined in .env file. Using default port 4004.");
}

/**
 * @description
 * This is the main entry point for the Categories service.
 * It creates an instance of ApolloServer and sets up the server to listen on port 4004.
 */
async function startServer() {
  const database = new CategoriesDatabase();
  await database.createTables();

  const repository = new CategoriesRepository(database);
  const { schema } = new CategorySchema(repository);

  const server = new ApolloServer({
    schema: buildSubgraphSchema([schema]),
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({}) => ({
      dataloaders: createDataLoaders(new AegSDK()),
    }),
    listen: { port },
  });

  console.log(`🚀 Categories service ready at ${url}`);
}

startServer();
