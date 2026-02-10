import { createOpenAI } from '@ai-sdk/openai';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [];

export const OpenAILikeProvider: ProviderInfo = {
  name: 'OpenAILike',
  staticModels,
  getModelInstance({ model, apiKeys, settings }) {
    const apiKey = apiKeys?.OPENAI_LIKE_API_KEY || process.env.OPENAI_LIKE_API_KEY;
    const baseURL = settings?.baseUrl || process.env.OPENAI_LIKE_API_BASE_URL || '';
    const openai = createOpenAI({ apiKey, baseURL });
    return openai(model);
  },
  isEnabled() {
    return true;
  },
};
