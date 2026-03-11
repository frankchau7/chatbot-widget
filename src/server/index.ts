import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server),
  );

  const port = 4000;
  app.listen(port, () => {
    console.log(`🚀 GraphQL server ready at http://localhost:${port}/graphql`);
  });
}

startServer().catch(console.error);