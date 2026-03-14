import { useState, useEffect } from "react";
import botAvatar from "../assets/bot_avatar.jpg";
import TextBox from "./TextBox/TextBox";
import GreetingNotification from "./GreetingNotification";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(true);
    }, 5000); // 5 seconds

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
        <GreetingNotification onClose={() => setShowGreeting(false)} />
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
