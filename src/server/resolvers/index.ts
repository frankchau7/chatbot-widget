import { sendMessageResolvers } from "./sendMessage.resolver";

export const resolvers = {
  Query: {
    ...sendMessageResolvers.Query,
  },
  Mutation: {
    ...sendMessageResolvers.Mutation,
  },
};

