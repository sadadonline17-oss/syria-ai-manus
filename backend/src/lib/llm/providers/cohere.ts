import { createCohere } from '@ai-sdk/cohere';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'command-r-plus', label: 'Command R+', provider: 'Cohere', maxTokenAllowed: 4000 },
  { name: 'command-r', label: 'Command R', provider: 'Cohere', maxTokenAllowed: 4000 },
];

export const CohereProvider: ProviderInfo = {
  name: 'Cohere',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    const apiKey = apiKeys?.COHERE_API_KEY || process.env.COHERE_API_KEY;
    const cohere = createCohere({ apiKey });
    return cohere(model);
  },
  isEnabled() {
    return true;
  },
};
