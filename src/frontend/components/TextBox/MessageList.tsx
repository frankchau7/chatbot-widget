import React from "react";
import type { Message } from "../../types";
import { BotMessage } from "../Message/BotMessage";
import { UserMessage } from "../Message/UserMessage";
import { TypingIndicator } from "../Message/TypingIndicator";

interface MessageListProps {
  messages: Message[];
  isHideSend: boolean;
  readOnly: boolean;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList = ({
  messages,
  isHideSend,
  readOnly,
  messagesContainerRef,
}: MessageListProps) => {
  return (
    <div
      ref={messagesContainerRef}
      className="px-4 py-3 h-[500px] w-[350px] overflow-y-auto space-y-4 bg-white text-left"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.map((message, index) => {
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
          return <BotMessage key={index} message={message} timeLabel={timeLabel} />;
        }

        return <UserMessage key={index} message={message} timeLabel={timeLabel} />;
      })}
      {isHideSend && !readOnly && <TypingIndicator />}
    </div>
  );
};
