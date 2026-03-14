import { useState, useEffect } from "react";
import botAvatar from "../assets/bot_avatar.jpg";
import TextBox from "./TextBox/TextBox";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setHasBeenOpened(true);
    if (!isOpen) {
      setShowGreeting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {hasBeenOpened && (
        <div className={`mb-1 ${isOpen ? "block" : "hidden"}`}>
          <TextBox isOpen={isOpen} />
        </div>
      )}

      {!isOpen && showGreeting && (
        <div className="relative mb-2 animate-bounce-slow">
          <div className="bg-sky-600 text-white px-4 py-3 rounded-2xl shadow-xl max-w-[240px] text-sm font-medium relative leading-relaxed">
            Hey! I am your AI receptionist! Let me know if you want to book, or have any enquiries!
            {/* Triangle indicator */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-sky-600 rotate-45 transform"></div>
          </div>
          <button 
            onClick={() => setShowGreeting(false)}
            className="absolute -top-2 -right-2 bg-slate-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-slate-700 shadow-md border border-white"
          >
            ✕
          </button>
        </div>
      )}

      <div
        role="button"
        aria-label="Open chat"
        onClick={handleClick}
        className="bg-white text-black shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
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
