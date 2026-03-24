import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schemas/index.ts";
import { resolvers } from "./resolvers/index.ts";
import { setupRAG } from "./lib/rag";

async function startServer() {
  const app = express();

  // Initialize RAG with the clinic's website
  // In a real app, this might be triggered by an admin or on a schedule
  const CLINIC_URL = process.env.CLINIC_URL || "https://claytondentalclinic.com.au/"; // Example URL
  console.log(`Initializing RAG for ${CLINIC_URL}...`);
  setupRAG(CLINIC_URL).then(() => {
    console.log("✅ RAG initialized successfully");
  }).catch(err => {
    console.error("❌ RAG initialization failed:", err.message);
    console.log("Chatbot will continue to work using basic LLM fallback.");
  });

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