import { createAnthropic } from '@ai-sdk/anthropic';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4', provider: 'Anthropic', maxTokenAllowed: 8000 },
  { name: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', provider: 'Anthropic', maxTokenAllowed: 8000 },
  { name: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', provider: 'Anthropic', maxTokenAllowed: 8000 },
  { name: 'claude-3-opus-20240229', label: 'Claude 3 Opus', provider: 'Anthropic', maxTokenAllowed: 8000 },
];

export const AnthropicProvider: ProviderInfo = {
  name: 'Anthropic',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    const apiKey = apiKeys?.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
    const anthropic = createAnthropic({ apiKey });
    return anthropic(model);
  },
  isEnabled() {
    return true;
  },
};
