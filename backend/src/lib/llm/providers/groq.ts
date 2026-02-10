import { createOpenAI } from '@ai-sdk/openai';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', provider: 'Groq', maxTokenAllowed: 8000 },
  { name: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', provider: 'Groq', maxTokenAllowed: 8000 },
  { name: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', provider: 'Groq', maxTokenAllowed: 8000 },
  { name: 'gemma2-9b-it', label: 'Gemma 2 9B', provider: 'Groq', maxTokenAllowed: 8000 },
];

export const GroqProvider: ProviderInfo = {
  name: 'Groq',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    const apiKey = apiKeys?.GROQ_API_KEY || process.env.GROQ_API_KEY;
    const groq = createOpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });
    return groq(model);
  },
  isEnabled() {
    return true;
  },
};
