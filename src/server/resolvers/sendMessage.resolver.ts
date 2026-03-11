export const sendMessageResolvers = {
  Query: {
    _health: () => "ok",
  },
  Mutation: {
    async sendMessage(_: unknown, args: { content: string }) {
      const now = new Date();
      // TODO: later call OpenAI here and use its reply instead of echoing
      return {
        id: crypto.randomUUID(),
        content: `Echo: ${args.content}`,
        sender: "bot",
        timestamp: now.toISOString(),
      };
    },
  },
};