import { createMistral } from '@ai-sdk/mistral';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'mistral-large-latest', label: 'Mistral Large', provider: 'Mistral', maxTokenAllowed: 8000 },
  { name: 'mistral-medium-latest', label: 'Mistral Medium', provider: 'Mistral', maxTokenAllowed: 8000 },
  { name: 'mistral-small-latest', label: 'Mistral Small', provider: 'Mistral', maxTokenAllowed: 8000 },
  { name: 'codestral-latest', label: 'Codestral', provider: 'Mistral', maxTokenAllowed: 8000 },
];

export const MistralProvider: ProviderInfo = {
  name: 'Mistral',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    const apiKey = apiKeys?.MISTRAL_API_KEY || process.env.MISTRAL_API_KEY;
    const mistral = createMistral({ apiKey });
    return mistral(model);
  },
  isEnabled() {
    return true;
  },
};
