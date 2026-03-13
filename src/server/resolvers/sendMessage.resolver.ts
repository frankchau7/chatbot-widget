import OpenAI from "openai";
import type { Message, MessageDTO, Session } from "../types";

const openai = new OpenAI({
  apiKey: "ollama",
  baseURL: "http://localhost:11434/v1", // Your local Ollama
});

//TODO: need to figure out about the sessions, might need to get from cache
const systemPrompt = `You are a personal travel agent and you want to recommend places for someone to go that is within their budget and location and age.
Your replies should be like you are replying in real life.`;

const sessions = new Map<string, Session>();

export const sendMessageResolvers = {
  Query: {
    _health: () => "ok",
  },
  Mutation: {
    async sendMessage(
      _: unknown,
      args: { sessionId: string; content: string },
    ): Promise<Session> {
      const sessionId = args.sessionId;
      const message = args.content;
      let session = sessions.get(args.sessionId);
      const now = new Date();

      // Initialise if no session in the map
      if (!session) {
        session = {
          id: sessionId,
          messages: [
            {
              content: systemPrompt,
              sender: "system",
              timestamp: now.toISOString(),
            }
          ],
        };
        sessions.set(sessionId, session);
      }
      
      console.log("TESTING", session);

      // Handle user message
      // TODO: check if we need id
      session.messages.push({
        content: message,
        sender: "user",
        timestamp: now.toISOString(),
      });

      const messages = session.messages.map((message) => {
        return {
          role: message.sender,
          content: message.content,
        };
      });

      const completion = await openai.chat.completions.create({
        model: "phi3:mini",
        messages,
      });

      const reply =
        completion.choices[0].message.content ||
        "Sorry was not able to process the message. Please try again!";

      console.log("REPLY: ", reply)

      const assistantTime = new Date();

      session.messages.push({
        sender: "assistant",
        content: reply,
        timestamp: assistantTime.toISOString(),
      });

      return session;
    },
  },
};
