import { createOpenAI } from '@ai-sdk/openai';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [];

export const LMStudioProvider: ProviderInfo = {
  name: 'LMStudio',
  staticModels,
  async getDynamicModels(_apiKeys, settings) {
    const baseUrl = settings?.baseUrl || process.env.LMSTUDIO_API_BASE_URL || 'http://127.0.0.1:1234';
    try {
      const response = await fetch(`${baseUrl}/v1/models`);
      const data = (await response.json()) as { data: Array<{ id: string }> };
      return data.data.map((m: { id: string }) => ({
        name: m.id,
        label: m.id,
        provider: 'LMStudio',
        maxTokenAllowed: 8000,
      }));
    } catch {
      return [];
    }
  },
  getModelInstance({ model, settings }) {
    const baseURL = settings?.baseUrl || process.env.LMSTUDIO_API_BASE_URL || 'http://127.0.0.1:1234';
    const lmstudio = createOpenAI({ apiKey: 'lm-studio', baseURL: `${baseURL}/v1` });
    return lmstudio(model);
  },
  isEnabled() {
    return true;
  },
};
