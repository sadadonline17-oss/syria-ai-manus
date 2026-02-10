export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model: string;
  provider: string;
  apiKeys?: Record<string, string>;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  id: string;
  message: ChatMessage;
  model: string;
  provider: string;
}
