import { Hono } from 'hono';
import { streamText } from 'ai';
import { llmManager } from '../lib/llm/manager';
import { getSystemPrompt } from '../lib/prompts/system-prompt';

const chat = new Hono();

chat.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { messages, model, provider, apiKeys, maxTokens, temperature } = body;

    if (!messages || !model || !provider) {
      return c.json({ error: 'messages, model, and provider are required' }, 400);
    }

    const modelInstance = llmManager.getModelInstance({
      provider,
      model,
      apiKeys,
    });

    const systemPrompt = getSystemPrompt();
    const allMessages = [{ role: 'system' as const, content: systemPrompt }, ...messages];

    const result = streamText({
      model: modelInstance,
      messages: allMessages,
      maxOutputTokens: maxTokens || 4096,
      temperature: temperature ?? 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat error:', message);
    return c.json({ error: message }, 500);
  }
});

export default chat;
