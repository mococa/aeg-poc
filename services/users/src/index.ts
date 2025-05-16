/* ---------- External ---------- */
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startStandaloneServer } from "@apollo/server/standalone";

/* ---------- Service ---------- */
import { UserSchema } from "@aeg-poc/schemas";

/* ---------- Constants ---------- */
const port = Number(process.env.PORT ?? 4001);
if (!port) {
  console.error("users PORT is not defined in .env file. Using default port 4001.");
}
const server = new ApolloServer({
  schema: buildSubgraphSchema([UserSchema]),
});

/**
 * @description
 * This is the main entry point for the User service.
 * It creates an instance of ApolloServer and sets up the server to listen on port 4001.
 */
async function startServer() {
  const { url } = await startStandaloneServer(server, { listen: { port } });

  console.log(`🚀 Users service ready at ${url}`);
}

startServer();
