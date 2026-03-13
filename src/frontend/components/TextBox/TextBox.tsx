import { useState } from "react";
import type { Message, Session } from "../../types";
import { SEND_MESSAGE_MUTATION } from "./mutations";
import { useMutation } from "@apollo/client/react";
import { BotMessage } from "../Message/BotMessage";
import { UserMessage } from "../Message/UserMessage";
import { TextInput } from "./TextInput";
import { Banner } from "./Banner";

interface SendMessageData {
  sendMessage: Session;
}

const TextBox = () => {
  const [sendMessage] = useMutation<SendMessageData>(SEND_MESSAGE_MUTATION);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      content: "Hi! How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");

  const handleMessageSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsSending(true);
    try {
      const { data } = await sendMessage({
        variables: { sessionId, content: trimmed },
      });
      if (data?.sendMessage) {
        const session = data.sendMessage;
        // Use session messages from server, filtering out system prompt
        const serverMessages: Message[] = session.messages
          .filter((m: Message) => m.sender !== "system")
          .map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
        setMessages(serverMessages);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white text-black rounded-xl shadow-lg overflow-hidden">
      <Banner />

      {/* Conversation area */}
      <div className="px-4 py-3 h-[500px] w-[350px] overflow-y-auto space-y-4 bg-white text-left">
        {messages.map((message) => {
          const time =
            message.timestamp instanceof Date
              ? message.timestamp
              : new Date(message.timestamp);
          const timeLabel = time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const isBot = message.sender === "assistant";

          if (isBot) {
            return <BotMessage message={message} timeLabel={timeLabel} />;
          }

          return <UserMessage message={message} timeLabel={timeLabel} />;
        })}
      </div>

      {!isSending && (
        <TextInput
          input={input}
          setInput={setInput}
          handleMessageSend={handleMessageSend}
        />
      )}
    </div>
  );
};

export default TextBox;
