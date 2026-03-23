import { sendMessageResolvers } from "./sendMessage.resolver.js";

export const resolvers = {
  Query: {
    ...sendMessageResolvers.Query,
  },
  Mutation: {
    ...sendMessageResolvers.Mutation,
  },
};

