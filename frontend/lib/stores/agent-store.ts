import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Agent } from '../agents';

interface AgentState {
  selectedAgent: Agent | null;
  systemPrompt: string;
  setSelectedAgent: (agent: Agent | null) => void;
  setSystemPrompt: (prompt: string) => void;
  resetAgent: () => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      selectedAgent: null,
      systemPrompt: '',
      setSelectedAgent: (agent) => set({ selectedAgent: agent }),
      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
      resetAgent: () => set({ selectedAgent: null, systemPrompt: '' }),
    }),
    {
      name: 'agent-storage',
    }
  )
);
