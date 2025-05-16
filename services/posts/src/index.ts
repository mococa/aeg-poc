/* ---------- External ---------- */
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";

/* ---------- Service ---------- */
import { PostSchema } from "@aeg-poc/schemas";

/* ---------- Constants ---------- */
const port = Number(process.env.PORT ?? 4002);
if (!port) {
  console.error("posts PORT is not defined in .env file. Using default port 4002.");
}
const server = new ApolloServer({
  schema: buildSubgraphSchema([PostSchema]),
});

/**
 * @description
 * This is the main entry point for the User service.
 * It creates an instance of ApolloServer and sets up the server to listen on port 4001.
 */
async function startServer() {
  const { url } = await startStandaloneServer(server, { listen: { port } });

  console.log(`🚀 Posts service ready at ${url}`);
}

startServer();
