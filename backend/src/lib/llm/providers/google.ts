import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash', provider: 'Google', maxTokenAllowed: 8000 },
  { name: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro', provider: 'Google', maxTokenAllowed: 8000 },
  { name: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash', provider: 'Google', maxTokenAllowed: 8000 },
];

export const GoogleProvider: ProviderInfo = {
  name: 'Google',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    const apiKey = apiKeys?.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const google = createGoogleGenerativeAI({ apiKey });
    return google(model);
  },
  isEnabled() {
    return true;
  },
};
