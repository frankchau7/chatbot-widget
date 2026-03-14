import React, {useCallback, useEffect, useRef, useState} from "react";
import type {Message, Session} from "../../types";
import {SEND_MESSAGE_MUTATION} from "./mutations";
import {useMutation} from "@apollo/client/react";
import {TextInput} from "./TextInput";
import {Banner} from "./Banner";
import {Popup} from "./Popup.tsx";
import {WelcomeScreen} from "./WelcomeScreen";
import {MessageList} from "./MessageList";
import {NewChatButton} from "./NewChatButton";

interface SendMessageData {
  sendMessage: Session;
}

const initialMessage: Message = {
  content: "Hi! How can I help you today?",
  sender: "assistant",
  timestamp: new Date(),
};

interface TextBoxProps {
  isOpen: boolean;
}

const TextBox = ({ isOpen }: TextBoxProps) => {
  const [sendMessage] = useMutation<SendMessageData>(SEND_MESSAGE_MUTATION);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isHideSend, setIsHideSend] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [input, setInput] = useState("");
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => {
    const cached = localStorage.getItem("userData");
    return cached ? JSON.parse(cached) : { fullName: "", phone: "", email: "" };
  });
  const [errors, setErrors] = useState({ phone: "", email: "" });

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    let isValid = true;
    const newErrors = { phone: "", email: "" };

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    if (formData.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    setErrors(newErrors);
    if (isValid) {
      localStorage.setItem("userData", JSON.stringify(formData));
      setIsFormSubmitted(true);
      setIsEditing(false);
    }
  };

  const handleStartNewChat = () => {
    setSessionId(crypto.randomUUID());
    setMessages([initialMessage]);
    setReadOnly(false);
    setIsHideSend(false);
    setInput("");
    setIsFormSubmitted(false);
    const cached = localStorage.getItem("userData");
    setFormData(cached ? JSON.parse(cached) : { fullName: "", phone: "", email: "" });
    setErrors({ phone: "", email: "" });
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
    setIsEditing(false);
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
  }, [messages, isHideSend, scrollToBottom, readOnly, isOpen]);

  return (
      <div className="w-full max-w-md bg-white text-black rounded-xl shadow-lg overflow-hidden relative">
        <Banner 
          onEditDetails={() => setIsEditing(true)} 
          onEndConversation={() => setShowExitPopup(true)} 
          readOnly={readOnly} 
          showMenu={isFormSubmitted && !isEditing}
        />

        {!isFormSubmitted || isEditing ? (
            <WelcomeScreen
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                handleStartChat={handleStartChat}
                isEditing={isEditing}
            />
        ) : (
            <>
              <MessageList
                  messages={messages}
                  isHideSend={isHideSend}
                  readOnly={readOnly}
                  messagesContainerRef={messagesContainerRef}
              />

              {readOnly ? (
                  <NewChatButton handleStartNewChat={handleStartNewChat}/>
              ) : !isHideSend && (
                  <TextInput
                      input={input}
                      setInput={setInput}
                      handleMessageSend={handleMessageSend}
                  />
              )}
            </>
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
