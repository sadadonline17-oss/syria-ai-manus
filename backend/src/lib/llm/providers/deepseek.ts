import { createDeepSeek } from '@ai-sdk/deepseek';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'deepseek-chat', label: 'DeepSeek V3', provider: 'DeepSeek', maxTokenAllowed: 8000 },
  { name: 'deepseek-reasoner', label: 'DeepSeek R1', provider: 'DeepSeek', maxTokenAllowed: 8000 },
];

export const DeepSeekProvider: ProviderInfo = {
  name: 'DeepSeek',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    const apiKey = apiKeys?.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY;
    const deepseek = createDeepSeek({ apiKey });
    return deepseek(model);
  },
  isEnabled() {
    return true;
  },
};
