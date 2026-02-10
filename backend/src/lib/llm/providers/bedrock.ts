import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import type { ModelInfo, ProviderInfo } from '../../../types/provider';

const staticModels: ModelInfo[] = [
  { name: 'anthropic.claude-3-5-sonnet-20241022-v2:0', label: 'Claude 3.5 Sonnet (Bedrock)', provider: 'AmazonBedrock', maxTokenAllowed: 8000 },
  { name: 'anthropic.claude-3-haiku-20240307-v1:0', label: 'Claude 3 Haiku (Bedrock)', provider: 'AmazonBedrock', maxTokenAllowed: 8000 },
];

export const AmazonBedrockProvider: ProviderInfo = {
  name: 'AmazonBedrock',
  staticModels,
  getModelInstance({ model, apiKeys }) {
    const bedrock = createAmazonBedrock({
      region: apiKeys?.AWS_REGION || process.env.AWS_REGION || 'us-east-1',
      accessKeyId: apiKeys?.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: apiKeys?.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
    });
    return bedrock(model);
  },
  isEnabled() {
    return true;
  },
};
