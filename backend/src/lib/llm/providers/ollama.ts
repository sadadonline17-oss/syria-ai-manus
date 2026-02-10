import { createOllama } from 'ollama-ai-provider';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [];

export const OllamaProvider: ProviderInfo = {
  name: 'Ollama',
  staticModels,
  async getDynamicModels(apiKeys, settings) {
    const baseUrl = settings?.baseUrl || process.env.OLLAMA_API_BASE_URL || 'http://127.0.0.1:11434';
    try {
      const response = await fetch(`${baseUrl}/api/tags`);
      const data = (await response.json()) as { models: Array<{ name: string }> };
      return data.models.map((m: { name: string }) => ({
        name: m.name,
        label: m.name,
        provider: 'Ollama',
        maxTokenAllowed: 8000,
      }));
    } catch {
      return [];
    }
  },
  getModelInstance({ model, settings }) {
    const baseUrl = settings?.baseUrl || process.env.OLLAMA_API_BASE_URL || 'http://127.0.0.1:11434';
    const ollama = createOllama({ baseURL: `${baseUrl}/api` });
    return ollama(model);
  },
  isEnabled() {
    return true;
  },
};
