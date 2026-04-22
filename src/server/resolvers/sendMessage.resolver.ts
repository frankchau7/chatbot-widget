import OpenAI from "openai";
import type { Session } from "../types";
import { chatWithRAG } from "../lib/rag";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

const openai = new OpenAI({
  apiKey: "ollama",
  baseURL: `${OLLAMA_BASE_URL}/v1`,
});

const systemPrompt = `You are Melbourne Dental Bot at 25 Highbury Rd, Glen Waverley. Checkups $150, cleans $120, emergencies $250. Mon-Fri 9-5. 
Keep replies to 50 words or less, friendly like reception staff. 
Off-topic? "Sorry, I handle dental bookings only! What service can I help with?" Always offer to book.`;

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

      // Handle user message
      session.messages.push({
        content: message,
        sender: "user",
        timestamp: now.toISOString(),
      });

      let reply: string;
      try {
        // Use RAG instead of direct OpenAI call
        reply = await chatWithRAG(message);
        
        if (!reply) {
          reply = "Sorry was not able to process the message. Please try again!";
        }
      } catch (error) {
        console.error("Error in sendMessage resolver (RAG):", error);
        
        // Fallback to direct OpenAI if RAG fails (e.g. Chroma or Ollama not running)
        try {
          const messages = session.messages.map((message) => {
            return {
              role: message.sender,
              content: message.content,
            };
          });

          const completion = await openai.chat.completions.create({
            model: "qwen3:8b",
            messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
          });
          
          reply = completion.choices[0].message.content || 
                  "Sorry was not able to process the message. Please try again!";
        } catch (fallbackError) {
          console.error("Error in sendMessage resolver (Fallback):", fallbackError);
          reply = "Sorry was not able to process the message. Please try again!";
        }
      }

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
