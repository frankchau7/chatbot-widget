import type { JSX } from "react";
import botAvatar from "../../assets/bot_avatar.jpg";

/**
 * Renders a bot-style message bubble with three animated bouncing dots,
 * giving the appearance that the bot is typing a response.
 */
export const TypingIndicator = (): JSX.Element => {
  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
        <img
          src={botAvatar}
          alt="Chatbot avatar"
          className="w-7 h-7 rounded-full object-cover"
        />
      </div>
      <div className="flex max-w-[70%] min-w-0 flex-col">
        <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-1.5">
          <span className="typing-dot" style={{ animationDelay: "0s" }} />
          <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
          <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};
