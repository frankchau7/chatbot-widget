export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system' | 'assistant';
  timestamp: Date;
}

export interface Session {
  id: string;
  messages: Message[];
}

export interface MessageProps {
  message: Message;
  timeLabel: string;
}