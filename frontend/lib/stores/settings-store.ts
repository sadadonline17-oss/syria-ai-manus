import { create } from 'zustand';
import AsyncStorage from '../async-storage';

export interface ModelInfo {
  name: string;
  label: string;
  provider: string;
  maxTokenAllowed: number;
}

export interface ProviderConfig {
  name: string;
  isConfigured: boolean;
  isLocal: boolean;
  staticModels: ModelInfo[];
}

interface SettingsState {
  apiKeys: Record<string, string>;
  selectedProvider: string;
  selectedModel: string;
  enabledProviders: Record<string, boolean>;
  localModelUrls: Record<string, string>;
  githubToken: string;
  gitlabToken: string;
  gitlabUrl: string;
  maxTokens: number;
  temperature: number;
  setApiKey: (key: string, value: string) => void;
  removeApiKey: (key: string) => void;
  setSelectedProvider: (provider: string) => void;
  setSelectedModel: (model: string) => void;
  toggleProvider: (name: string) => void;
  setLocalModelUrl: (provider: string, url: string) => void;
  setGithubToken: (token: string) => void;
  setGitlabToken: (token: string) => void;
  setGitlabUrl: (url: string) => void;
  setMaxTokens: (tokens: number) => void;
  setTemperature: (temp: number) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  apiKeys: {},
  selectedProvider: 'Manus',
  selectedModel: 'manus-agi',
  enabledProviders: {},
  localModelUrls: {
    Ollama: 'http://127.0.0.1:11434',
    LMStudio: 'http://127.0.0.1:1234',
  },
  githubToken: '',
  gitlabToken: '',
  gitlabUrl: 'https://gitlab.com',
  maxTokens: 4096,
  temperature: 0.7,

  setApiKey: (key, value) => {
    const apiKeys = { ...get().apiKeys, [key]: value };
    set({ apiKeys });
    AsyncStorage.setItem('apiKeys', JSON.stringify(apiKeys));
  },

  removeApiKey: (key) => {
    const apiKeys = { ...get().apiKeys };
    delete apiKeys[key];
    set({ apiKeys });
    AsyncStorage.setItem('apiKeys', JSON.stringify(apiKeys));
  },

  setSelectedProvider: (provider) => {
    set({ selectedProvider: provider });
    AsyncStorage.setItem('selectedProvider', provider);
  },

  setSelectedModel: (model) => {
    set({ selectedModel: model });
    AsyncStorage.setItem('selectedModel', model);
  },

  toggleProvider: (name) => {
    const enabledProviders = { ...get().enabledProviders };
    enabledProviders[name] = !enabledProviders[name];
    set({ enabledProviders });
    AsyncStorage.setItem('enabledProviders', JSON.stringify(enabledProviders));
  },

  setLocalModelUrl: (provider, url) => {
    const localModelUrls = { ...get().localModelUrls, [provider]: url };
    set({ localModelUrls });
    AsyncStorage.setItem('localModelUrls', JSON.stringify(localModelUrls));
  },

  setGithubToken: (token) => {
    set({ githubToken: token });
    AsyncStorage.setItem('githubToken', token);
  },

  setGitlabToken: (token) => {
    set({ gitlabToken: token });
    AsyncStorage.setItem('gitlabToken', token);
  },

  setGitlabUrl: (url) => {
    set({ gitlabUrl: url });
    AsyncStorage.setItem('gitlabUrl', url);
  },

  setMaxTokens: (tokens) => {
    set({ maxTokens: tokens });
    AsyncStorage.setItem('maxTokens', tokens.toString());
  },

  setTemperature: (temp) => {
    set({ temperature: temp });
    AsyncStorage.setItem('temperature', temp.toString());
  },

  loadSettings: async () => {
    try {
      const [
        apiKeysStr,
        provider,
        model,
        enabledStr,
        localUrlsStr,
        ghToken,
        glToken,
        glUrl,
        maxTok,
        temp,
      ] = await Promise.all([
        AsyncStorage.getItem('apiKeys'),
        AsyncStorage.getItem('selectedProvider'),
        AsyncStorage.getItem('selectedModel'),
        AsyncStorage.getItem('enabledProviders'),
        AsyncStorage.getItem('localModelUrls'),
        AsyncStorage.getItem('githubToken'),
        AsyncStorage.getItem('gitlabToken'),
        AsyncStorage.getItem('gitlabUrl'),
        AsyncStorage.getItem('maxTokens'),
        AsyncStorage.getItem('temperature'),
      ]);
      set({
        apiKeys: apiKeysStr ? JSON.parse(apiKeysStr) : {},
        selectedProvider: provider || 'Manus',
        selectedModel: model || 'manus-agi',
        enabledProviders: enabledStr ? JSON.parse(enabledStr) : {},
        localModelUrls: localUrlsStr
          ? JSON.parse(localUrlsStr)
          : { Ollama: 'http://127.0.0.1:11434', LMStudio: 'http://127.0.0.1:1234' },
        githubToken: ghToken || '',
        gitlabToken: glToken || '',
        gitlabUrl: glUrl || 'https://gitlab.com',
        maxTokens: maxTok ? parseInt(maxTok) : 4096,
        temperature: temp ? parseFloat(temp) : 0.7,
      });
    } catch {
      // ignore
    }
  },
}));
