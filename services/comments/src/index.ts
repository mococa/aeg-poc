/* ---------- External ---------- */
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";

/* ---------- Utils ---------- */
import { createDataLoaders } from "@aeg-poc/utils";

/* ---------- SDK ---------- */
import { AegSDK } from "@aeg-poc/sdk";

/* ---------- Database ---------- */
import { CommentsDatabase, CommentsRepository } from "./database";

/* ---------- Schema ---------- */
import { CommentSchema } from "./schema";

/* ---------- Constants ---------- */
const port = Number(process.env.PORT ?? 4003);
if (!port) {
  console.error("comments PORT is not defined in .env file. Using default port 4003.");
}

/**
 * @description
 * This is the main entry point for the Comments service.
 * It creates an instance of ApolloServer and sets up the server to listen on port 4003.
 */
async function startServer() {
  const database = new CommentsDatabase();
  await database.createTables();

  const repository = new CommentsRepository(database);
  const { schema } = new CommentSchema(repository);

  const server = new ApolloServer({
    schema: buildSubgraphSchema([schema]),
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({}) => ({
      dataloaders: createDataLoaders(new AegSDK()),
    }),
    listen: { port },
  });

  console.log(`🚀 Comments service ready at ${url}`);
}

startServer();
