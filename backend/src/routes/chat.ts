import { Hono } from 'hono';
import { streamText } from 'ai';
import { llmManager } from '../lib/llm/manager';
import { getSystemPrompt } from '../lib/prompts/system-prompt';
import { manusTools } from '../lib/llm/tools';
import { globalMemory } from '../lib/llm/memory';

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

    // Integration: Fetch context from Long-term Memory
    const memoryContext = await globalMemory.getContextForPrompt();
    
    const systemPrompt = `${getSystemPrompt()}\n\n${memoryContext}`;
    const allMessages = [{ role: 'system' as const, content: systemPrompt }, ...messages];

    // Integration: Manus Tools and Agentic Stream
    const result = streamText({
      model: modelInstance,
      messages: allMessages,
      tools: manusTools,
      maxSteps: 5, // Enable multi-step reasoning like Manus
      maxOutputTokens: maxTokens || 4096,
      temperature: temperature ?? 0.7,
      onFinish: async ({ text }) => {
        // Integration: Save important info to memory on finish
        if (text.length > 50) {
          await globalMemory.remember(`interaction_${Date.now()}`, text.slice(0, 100), 0.5);
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat error:', message);
    return c.json({ error: message }, 500);
  }
});

export default chat;
