import type { JSX } from "react";
import botAvatar from "../../assets/bot_avatar.jpg";
import type { MessageProps } from "../../types";

/**
 * renders the bot avatar, grey box with the message content and time. This will come from the left side of the chatbox 
 * @param message: the message that the bot will send to the user
 * @param timeLabel: the time of when the message was sent 
 * @returns the bot avatar, blue box with the message content and time
 */
export const BotMessage = ({
  message,
  timeLabel,
}: MessageProps): JSX.Element => {
  return (
    <div key={message.id} className="flex items-start gap-2">
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
};
