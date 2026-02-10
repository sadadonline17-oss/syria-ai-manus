import { createOpenAI } from '@ai-sdk/openai';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'manus-agi', label: 'Manus AGI (General Intelligence)', provider: 'Manus', maxTokenAllowed: 128000 },
  { name: 'syria-ai-core', label: 'Syria AI Core', provider: 'Manus', maxTokenAllowed: 64000 },
];

/**
 * Manus Provider - Integrates Manus General Intelligence capabilities
 * into the Syria AI application.
 */
export const ManusProvider: ProviderInfo = {
  name: 'Manus',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    // Manus uses the internal OpenAI-compatible API configured in the environment
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    
    const manus = createOpenAI({ 
      apiKey,
      baseURL: baseUrl
    });
    
    // Map internal names to actual models if needed
    const modelName = model === 'manus-agi' ? 'gpt-4.1-mini' : 'gpt-4.1-mini';
    
    return manus(modelName);
  },
  isEnabled() {
    return true;
  },
};
