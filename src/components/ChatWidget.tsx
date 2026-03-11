import { useState } from "react";
import botAvatar from "../assets/bot_avatar.jpg";
import TextBox from "./TextBox";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="mb-1">
          <TextBox />
        </div>
      )}

      <div
        role="button"
        aria-label="Open chat"
        onClick={handleClick}
        className="bg-white text-black shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer"
      >
        <img
          src={botAvatar}
          alt="Chatbot avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default ChatWidget;
