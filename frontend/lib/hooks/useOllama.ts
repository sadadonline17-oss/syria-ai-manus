import { useState, useCallback } from 'react';
import { api } from '../api';

interface OllamaModel {
  name: string;
  model: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

interface OllamaTagResponse {
  models: OllamaModel[];
}

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    stop?: string[];
  };
}

interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[];
}

interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    stop?: string[];
  };
}

interface OllamaChatResponse {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

export function useOllama() {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [response, setResponse] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<OllamaChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async (host?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/providers/ollama/models${host ? `?host=${encodeURIComponent(host)}` : ''}`);
      const data = response.data as OllamaTagResponse;
      setModels(data.models || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Ollama models');
    } finally {
      setLoading(false);
    }
  }, []);

  const generate = useCallback(async (request: OllamaGenerateRequest) => {
    setLoading(true);
    setError(null);
    setResponse('');
    try {
      const response = await api.post('/api/providers/ollama/generate', request);
      const data = response.data as OllamaGenerateResponse;
      setResponse(data.response);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to generate response');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const chat = useCallback(async (request: OllamaChatRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/providers/ollama/chat', request);
      const data = response.data as OllamaChatResponse;
      setChatMessages(prev => [...prev, data.message]);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to get chat response');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
    setResponse('');
  }, []);

  const pullModel = useCallback(async (modelName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/providers/ollama/pull', { model: modelName });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to pull model');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteModel = useCallback(async (modelName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/providers/ollama/models/${encodeURIComponent(modelName)}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete model');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    models,
    response,
    chatMessages,
    loading,
    error,
    fetchModels,
    generate,
    chat,
    clearChat,
    pullModel,
    deleteModel,
  };
}
