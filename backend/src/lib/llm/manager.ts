import type { ModelInfo, ProviderInfo, ProviderSettings } from '../../types/provider';
import {
  ManusProvider,
  AnthropicProvider,
  OpenAIProvider,
  GoogleProvider,
  GroqProvider,
  MistralProvider,
  DeepSeekProvider,
  OpenRouterProvider,
  XAIProvider,
  CohereProvider,
  OllamaProvider,
  AmazonBedrockProvider,
  OpenAILikeProvider,
  LMStudioProvider,
} from './providers';

const PROVIDER_LIST: ProviderInfo[] = [
  ManusProvider,
  AnthropicProvider,
  OpenAIProvider,
  GoogleProvider,
  GroqProvider,
  MistralProvider,
  DeepSeekProvider,
  OpenRouterProvider,
  XAIProvider,
  CohereProvider,
  OllamaProvider,
  AmazonBedrockProvider,
  OpenAILikeProvider,
  LMStudioProvider,
];

class LLMManager {
  private providers: Map<string, ProviderInfo> = new Map();

  constructor() {
    for (const provider of PROVIDER_LIST) {
      this.providers.set(provider.name, provider);
    }
  }

  getProviderList(): ProviderInfo[] {
    return PROVIDER_LIST;
  }

  getProvider(name: string): ProviderInfo | undefined {
    return this.providers.get(name);
  }

  getAllStaticModels(): ModelInfo[] {
    const models: ModelInfo[] = [];
    for (const provider of PROVIDER_LIST) {
      models.push(...provider.staticModels);
    }
    return models;
  }

  async getModelsByProvider(
    providerName: string,
    apiKeys?: Record<string, string>,
    settings?: ProviderSettings,
  ): Promise<ModelInfo[]> {
    const provider = this.providers.get(providerName);
    if (!provider) return [];

    const models = [...provider.staticModels];
    if (provider.getDynamicModels) {
      const dynamicModels = await provider.getDynamicModels(apiKeys, settings);
      models.push(...dynamicModels);
    }
    return models;
  }

  getModelInstance(options: {
    provider: string;
    model: string;
    apiKeys?: Record<string, string>;
    settings?: ProviderSettings;
  }): any {
    const providerInfo = this.providers.get(options.provider);
    if (!providerInfo) {
      throw new Error(`Provider ${options.provider} not found`);
    }
    return providerInfo.getModelInstance({
      model: options.model,
      apiKeys: options.apiKeys,
      settings: options.settings,
    });
  }
}

export const llmManager = new LLMManager();
export { PROVIDER_LIST };
