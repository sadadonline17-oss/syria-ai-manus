/**
 * Agent Routes for Syria AI
 * Handles agent selection, tools, and execution
 */

import { Hono } from 'hono';
import { getToolsForAgent } from '../lib/agent-tools';

const agents = new Hono();

// Get available agents
agents.get('/list', async (c) => {
  return c.json({
    agents: [
      { id: 'cursor', name: 'Cursor', category: 'code' },
      { id: 'windsurf', name: 'Windsurf', category: 'code' },
      { id: 'claude', name: 'Claude', category: 'general' },
      { id: 'devin', name: 'Devin AI', category: 'code' },
      { id: 'perplexity', name: 'Perplexity', category: 'search' },
      { id: 'replit', name: 'Replit', category: 'code' },
      { id: 'v0', name: 'v0', category: 'web' },
      { id: 'lovable', name: 'Lovable', category: 'web' },
      { id: 'manus', name: 'Manus', category: 'general' },
      { id: 'trae', name: 'Trae', category: 'code' },
      { id: 'warp', name: 'Warp', category: 'code' },
      { id: 'augment', name: 'Augment Code', category: 'code' },
      { id: 'xcode', name: 'Xcode', category: 'mobile' },
      { id: 'gemini', name: 'Gemini', category: 'general' },
      { id: 'chatgpt', name: 'ChatGPT', category: 'general' },
    ],
  });
});

// Get tools for a specific agent
agents.get('/tools/:agentId', async (c) => {
  const { agentId } = c.req.param();
  const tools = getToolsForAgent(agentId);
  return c.json({
    agentId,
    tools: tools.map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    })),
  });
});

// Execute an agent tool
agents.post('/execute', async (c) => {
  try {
    const { agentId, toolName, params } = await c.req.json();
    
    const tools = getToolsForAgent(agentId);
    const tool = tools.find(t => t.name === toolName);
    
    if (!tool) {
      return c.json({ error: `Tool ${toolName} not found` }, 404);
    }
    
    // Execute the tool
    const result = await tool.execute(params);
    
    return c.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default agents;
