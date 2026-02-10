import { Hono } from 'hono';
import { llmManager } from '../lib/llm/manager';

const providers = new Hono();

providers.get('/', (c) => {
  const providerList = llmManager.getProviderList().map((p) => ({
    name: p.name,
    staticModels: p.staticModels,
    hasDynamicModels: !!p.getDynamicModels,
    isEnabled: p.isEnabled(),
  }));
  return c.json({ providers: providerList });
});

providers.post('/configured', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { apiKeys } = body as { apiKeys?: Record<string, string> };

  const ENV_KEY_MAP: Record<string, string> = {
    Anthropic: 'ANTHROPIC_API_KEY',
    OpenAI: 'OPENAI_API_KEY',
    Google: 'GOOGLE_GENERATIVE_AI_API_KEY',
    Groq: 'GROQ_API_KEY',
    Mistral: 'MISTRAL_API_KEY',
    DeepSeek: 'DEEPSEEK_API_KEY',
    OpenRouter: 'OPEN_ROUTER_API_KEY',
    xAI: 'XAI_API_KEY',
    Cohere: 'COHERE_API_KEY',
  };

  const configured = llmManager.getProviderList().map((p) => {
    const envKey = ENV_KEY_MAP[p.name];
    const hasEnvKey = envKey ? !!process.env[envKey] : false;
    const hasClientKey = envKey && apiKeys ? !!apiKeys[envKey] : false;
    return {
      name: p.name,
      isConfigured: hasEnvKey || hasClientKey,
      isLocal: p.name === 'Ollama' || p.name === 'LMStudio',
      staticModels: p.staticModels,
    };
  });

  return c.json({ providers: configured });
});

export default providers;
