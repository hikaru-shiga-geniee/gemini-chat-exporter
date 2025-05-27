// Message types for communication between popup and content script

export interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface GetChatDataMessage {
  type: 'getChatData';
}

export interface ChatDataResponse {
  success: boolean;
  data: ChatMessage[];
  messageCount?: number;
  error?: string;
}

export type MessageType = GetChatDataMessage;
export type ResponseType = ChatDataResponse; 
