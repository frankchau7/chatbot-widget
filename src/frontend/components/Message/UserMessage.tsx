import type { MessageProps } from "../../types";

/**
 * renders the blue box with the message content and time. This will appear on the right side of the chatbox
 * @param message: the message that the bot will send to the user
 * @param timeLabel: the time of when the message was sent 
 * @returns the bot avatar, blue box with the message content and time
 */
export const UserMessage = ({message, timeLabel}: MessageProps) => {
  return (
    <div key={message.id} className="flex justify-end items-start gap-2">
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
};
