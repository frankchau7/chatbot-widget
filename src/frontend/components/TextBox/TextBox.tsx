import {useCallback, useEffect, useRef, useState} from "react";
import type {Message, Session} from "../../types";
import {SEND_MESSAGE_MUTATION} from "./mutations";
import {useMutation} from "@apollo/client/react";
import {BotMessage} from "../Message/BotMessage";
import {UserMessage} from "../Message/UserMessage";
import {TypingIndicator} from "../Message/TypingIndicator";
import {TextInput} from "./TextInput";
import {Banner} from "./Banner";
import {Popup} from "./Popup.tsx";

interface SendMessageData {
  sendMessage: Session;
}

const initialMessage: Message = {
  content: "Hi! How can I help you today?",
  sender: "assistant",
  timestamp: new Date(),
};

const TextBox = () => {
  const [sendMessage] = useMutation<SendMessageData>(SEND_MESSAGE_MUTATION);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isHideSend, setIsHideSend] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [input, setInput] = useState("");
  const [showExitPopup, setShowExitPopup] = useState(false);

  const handleStartNewChat = () => {
    setSessionId(crypto.randomUUID());
    setMessages([initialMessage]);
    setReadOnly(false);
    setIsHideSend(false);
    setInput("");
  }

  const handleMessageSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      content: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsHideSend(true);
    try {
      const {data} = await sendMessage({
        variables: {sessionId, content: trimmed},
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
        setMessages([initialMessage, ...serverMessages]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Add the error message to the chat locally if the server fails
      const errorMessage: Message = {
        content: "Sorry was not able to process the message. Please try again!",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsHideSend(false);
    }
  };

  const handleEndConversation = () => {
    setIsHideSend(true);
    setShowExitPopup(false);
    setReadOnly(true);
  }

  // ensure that the conversation area sticks to the bottom
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isHideSend, scrollToBottom, readOnly]);

  return (
      <div className="w-full max-w-md bg-white text-black rounded-xl shadow-lg overflow-hidden relative">
        <Banner onClose={() => setShowExitPopup(true)} readOnly={readOnly}/>

        {/* Conversation area */}
        <div
            ref={messagesContainerRef}
            className="px-4 py-3 h-[500px] w-[350px] overflow-y-auto space-y-4 bg-white text-left"
            style={{scrollBehavior: 'smooth'}}
        >
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
              return <BotMessage message={message} timeLabel={timeLabel}/>;
            }

            return <UserMessage message={message} timeLabel={timeLabel}/>;
          })}
          {isHideSend && !readOnly && <TypingIndicator/>}
        </div>

        {readOnly ? (
            <div className="px-4 py-3 border-t border-slate-200 bg-white flex justify-center">
              <button
                  onClick={handleStartNewChat}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm"
              >
                Start new chat
              </button>
            </div>
        ) : !isHideSend && (
            <TextInput
                input={input}
                setInput={setInput}
                handleMessageSend={handleMessageSend}
            />
        )}

        {showExitPopup && (
            <Popup setShowExitPopup={setShowExitPopup} handleEndConversation={handleEndConversation}>
              <p className="text-slate-800 font-medium mb-6">
                Are you sure you want to leave this chat?
              </p>
            </Popup>
        )}
      </div>
  );
};

export default TextBox;
