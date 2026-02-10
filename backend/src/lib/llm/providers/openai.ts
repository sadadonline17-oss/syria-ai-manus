import { createOpenAI } from '@ai-sdk/openai';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', maxTokenAllowed: 8000 },
  { name: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI', maxTokenAllowed: 8000 },
  { name: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI', maxTokenAllowed: 8000 },
  { name: 'o1', label: 'o1', provider: 'OpenAI', maxTokenAllowed: 8000 },
  { name: 'o1-mini', label: 'o1 Mini', provider: 'OpenAI', maxTokenAllowed: 8000 },
  { name: 'o3-mini', label: 'o3 Mini', provider: 'OpenAI', maxTokenAllowed: 8000 },
];

export const OpenAIProvider: ProviderInfo = {
  name: 'OpenAI',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    const apiKey = apiKeys?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    const openai = createOpenAI({ apiKey });
    return openai(model);
  },
  isEnabled() {
    return true;
  },
};
