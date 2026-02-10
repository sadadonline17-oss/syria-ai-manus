import { createXai } from '@ai-sdk/xai';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'grok-2-1212', label: 'Grok 2', provider: 'xAI', maxTokenAllowed: 8000 },
  { name: 'grok-2-vision-1212', label: 'Grok 2 Vision', provider: 'xAI', maxTokenAllowed: 8000 },
  { name: 'grok-beta', label: 'Grok Beta', provider: 'xAI', maxTokenAllowed: 8000 },
];

export const XAIProvider: ProviderInfo = {
  name: 'xAI',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    const apiKey = apiKeys?.XAI_API_KEY || process.env.XAI_API_KEY;
    const xai = createXai({ apiKey });
    return xai(model);
  },
  isEnabled() {
    return true;
  },
};
