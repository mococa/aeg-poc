/* ---------- External ---------- */
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloGateway } from "@apollo/gateway";
import { getServiceUrl } from "@aeg-poc/utils";

const production = process.env.NODE_ENV === "production";

const port = Number(process.env.PORT ?? 4000);
if (!port) {
  console.error("gateway PORT is not defined in .env file. Using default port 4000.");
}
/**
 * @description
 * This is the main entry point for the Apollo Gateway.
 * It creates an instance of ApolloGateway and sets up the server to listen on port 4000.
 * It also defines the service list for the gateway.
 */
async function startGateway() {
   const gateway = new ApolloGateway({
    serviceList: [
      { name: "users", url: getServiceUrl("users") },
      { name: "posts", url: getServiceUrl("posts") },
      { name: "comments", url: getServiceUrl("comments") },
      { name: "categories", url: getServiceUrl("categories") },
    ],
  });

  const server = new ApolloServer({
    gateway,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`🚀 Gateway ready at ${url}`);
}

startGateway();
