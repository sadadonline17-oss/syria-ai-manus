export interface ModelInfo {
  name: string;
  label: string;
  provider: string;
  maxTokenAllowed: number;
}

export interface ProviderInfo {
  name: string;
  staticModels: ModelInfo[];
  getDynamicModels?: (apiKeys?: Record<string, string>, settings?: ProviderSettings) => Promise<ModelInfo[]>;
  getModelInstance: (options: {
    model: string;
    apiKeys?: Record<string, string>;
    settings?: ProviderSettings;
  }) => any;
  isEnabled: () => boolean;
}

export interface ProviderSettings {
  enabled?: boolean;
  baseUrl?: string;
}
