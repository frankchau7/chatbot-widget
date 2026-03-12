export interface Message {
  id?: number;
  content: string;
  sender: 'user' | 'system' | 'assistant';
  timestamp: string;
}

export interface Session {
  id: string;
  messages: Message[];
}

export interface MessageDTO {
  role: string;
  content: string;
}