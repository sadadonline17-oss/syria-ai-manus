import { useState, useCallback } from 'react';
import { api } from '../api';

export type LLMProvider = 
  | 'openai' 
  | 'anthropic' 
  | 'google' 
  | 'groq' 
  | 'mistral' 
  | 'deepseek' 
  | 'openrouter' 
  | 'xai' 
  | 'cohere' 
  | 'bedrock' 
  | 'lmstudio' 
  | 'ollama' 
  | 'manus';

export interface LLMModel {
  id: string;
  name: string;
  provider: LLMProvider;
  context_length?: number;
  supports_streaming?: boolean;
  supports_function_calling?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

export interface ChatRequest {
  provider: LLMProvider;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  tools?: any[];
}

export interface ChatResponse {
  id: string;
  provider: LLMProvider;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ProviderConfig {
  provider: LLMProvider;
  name: string;
  apiKey?: string;
  baseUrl?: string;
  models: LLMModel[];
}

export function useLLMProviders() {
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [models, setModels] = useState<LLMModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/providers');
      setProviders(response.data.providers || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchModels = useCallback(async (provider: LLMProvider) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/providers/${provider}/models`);
      setModels(response.data.models || []);
    } catch (err: any) {
      setError(err.message || `Failed to fetch ${provider} models`);
    } finally {
      setLoading(false);
    }
  }, []);

  const chat = useCallback(async (request: ChatRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/chat', request);
      return response.data as ChatResponse;
    } catch (err: any) {
      setError(err.message || 'Failed to get chat response');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const streamChat = useCallback(async (request: ChatRequest, onChunk: (chunk: string) => void) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/chat/stream', {
        ...request,
        stream: true,
      }, {
        responseType: 'stream',
      });
      
      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        onChunk(chunkValue);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to stream chat response');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const testProvider = useCallback(async (provider: LLMProvider, apiKey: string, baseUrl?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/providers/test', {
        provider,
        apiKey,
        baseUrl,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to test provider');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProviderConfig = useCallback(async (config: ProviderConfig) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/providers/config', config);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to save provider config');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProviderConfig = useCallback(async (provider: LLMProvider) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/providers/${provider}/config`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get provider config');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    providers,
    models,
    loading,
    error,
    fetchProviders,
    fetchModels,
    chat,
    streamChat,
    testProvider,
    saveProviderConfig,
    getProviderConfig,
  };
}
