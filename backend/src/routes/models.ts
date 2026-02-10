import { Hono } from 'hono';
import { llmManager } from '../lib/llm/manager';

const models = new Hono();

models.get('/', (c) => {
  const allModels = llmManager.getAllStaticModels();
  return c.json({ models: allModels });
});

models.post('/:provider', async (c) => {
  const providerName = c.req.param('provider');
  const body = await c.req.json().catch(() => ({}));
  const { apiKeys, settings } = body as { apiKeys?: Record<string, string>; settings?: { baseUrl?: string } };

  const providerModels = await llmManager.getModelsByProvider(providerName, apiKeys, settings);
  return c.json({ models: providerModels });
});

export default models;
