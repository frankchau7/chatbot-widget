import { useState } from "react";
import botAvatar from "../../assets/bot_avatar.jpg";
import sendIcon from "../../assets/send_icon.png";
import type { Message } from "../../types";
import { SEND_MESSAGE_MUTATION } from "./mutations";
import { useMutation } from "@apollo/client/react";

const TextBox = () => {
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);
  const [messages, setMessages] = useState<Message[]>([{
    id: crypto.randomUUID(),
    content: "Hi! How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  }]);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");

  const handleMessageSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    setInput("");
    setIsSending(true);
    try {
      //TODO: fix the type of the data
      sendMessage({ variables: { content: trimmed } }).then(({ data }: any) => {
        if (data?.sendMessage) {
          setMessages([...messages, data.sendMessage]);
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  
  };

  return (
    <div className="w-full max-w-md bg-white text-black rounded-xl shadow-lg overflow-hidden">
      {/* Top banner with avatar */}
      <div className="flex items-center justify-center gap-3 bg-slate-100 px-4 h-16 border-b border-slate-200">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
          <img
            src={botAvatar}
            alt="Chatbot avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center leading-tight">
          <span className="text-sm font-semibold">Chatbot</span>
          <span className="text-xs text-slate-500">Ask me anything</span>
        </div>
      </div>

      {/* Conversation area */}
      <div className="px-4 py-3 h-[250px] w-[350px] overflow-y-auto space-y-4 bg-white">
        {messages.map((message) => {
          const time =
            message.timestamp instanceof Date
              ? message.timestamp
              : new Date(message.timestamp);
          const timeLabel = time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const isBot = message.sender === "bot";

          if (isBot) {
            // Bot message: left side, avatar + bubble, time on right of bubble
            return (
              <div
                key={message.id}
                className="flex items-start gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <img
                    src={botAvatar}
                    alt="Chatbot avatar"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </div>
                <div className="flex max-w-[70%] min-w-0 flex-col">
                  <div className="w-full bg-slate-100 rounded-2xl px-3 py-2 text-sm text-slate-800 break-words whitespace-pre-wrap overflow-hidden">
                    {message.content}
                  </div>
                  <span className="mt-1 self-end text-[10px] text-slate-400">
                    {timeLabel}
                  </span>
                </div>
              </div>
            );
          }

          // User message: right side, bubble aligned right, time on left of bubble
          return (
            <div
              key={message.id}
              className="flex justify-end items-start gap-2"
            >
              <div className="flex max-w-[70%] min-w-0 flex-col items-end">
                <div className="w-full bg-sky-500 text-white rounded-2xl px-3 py-2 text-sm break-words whitespace-pre-wrap overflow-hidden">
                  {message.content}
                </div>
                <span className="mt-1 self-start text-[10px] text-slate-400">
                  {timeLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Text input area */}
      {!isSending && (
        <div className="px-4 py-3 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <textarea
            className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            rows={3}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleMessageSend();
              }
            }}
          />
          <div
            role="button"
            aria-label="Send message"
            onClick={handleMessageSend}
            className="flex h-8 w-8 items-center justify-center cursor-pointer"
          >
            <img
              src={sendIcon}
              alt="Send"
              className="h-6 w-6 object-contain"
            />
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextBox;