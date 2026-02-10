import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'anthropic/claude-sonnet-4-20250514', label: 'Claude Sonnet 4 (OpenRouter)', provider: 'OpenRouter', maxTokenAllowed: 8000 },
  { name: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (OpenRouter)', provider: 'OpenRouter', maxTokenAllowed: 8000 },
  { name: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (Free)', provider: 'OpenRouter', maxTokenAllowed: 8000 },
  { name: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B', provider: 'OpenRouter', maxTokenAllowed: 8000 },
  { name: 'deepseek/deepseek-chat', label: 'DeepSeek V3 (OpenRouter)', provider: 'OpenRouter', maxTokenAllowed: 8000 },
  { name: 'deepseek/deepseek-r1', label: 'DeepSeek R1 (OpenRouter)', provider: 'OpenRouter', maxTokenAllowed: 8000 },
  { name: 'qwen/qwen-2.5-coder-32b-instruct', label: 'Qwen 2.5 Coder 32B', provider: 'OpenRouter', maxTokenAllowed: 8000 },
  { name: 'mistralai/mistral-large-2411', label: 'Mistral Large (OpenRouter)', provider: 'OpenRouter', maxTokenAllowed: 8000 },
];

export const OpenRouterProvider: ProviderInfo = {
  name: 'OpenRouter',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    const apiKey = apiKeys?.OPEN_ROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY;
    const openRouter = createOpenRouter({ apiKey });
    return openRouter.chat(model);
  },
  isEnabled() {
    return true;
  },
};
