import { create } from 'zustand';
import AsyncStorage from '../async-storage';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  provider: string;
  model: string;
}

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  createSession: (provider: string, model: string) => string;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => string;
  updateMessage: (id: string, content: string) => void;
  setStreaming: (val: boolean) => void;
  finishStreaming: (id: string) => void;
  clearMessages: () => void;
  loadSessions: () => Promise<void>;
  saveSessions: () => Promise<void>;
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 6);
}

function extractTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === 'user');
  if (!firstUser) return 'محادثة جديدة';
  const text = firstUser.content.trim();
  return text.length > 40 ? text.slice(0, 40) + '...' : text;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  isStreaming: false,

  createSession: (provider, model) => {
    const id = generateId();
    const session: ChatSession = {
      id,
      title: 'محادثة جديدة',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      provider,
      model,
    };
    set((s) => ({
      sessions: [session, ...s.sessions],
      activeSessionId: id,
      messages: [],
      isStreaming: false,
    }));
    get().saveSessions();
    return id;
  },

  switchSession: (id) => {
    const session = get().sessions.find((s) => s.id === id);
    if (session) {
      set({ activeSessionId: id, messages: [...session.messages], isStreaming: false });
    }
  },

  deleteSession: (id) => {
    const state = get();
    const filtered = state.sessions.filter((s) => s.id !== id);
    const newActive = state.activeSessionId === id ? null : state.activeSessionId;
    set({
      sessions: filtered,
      activeSessionId: newActive,
      messages: newActive ? state.messages : [],
    });
    get().saveSessions();
  },

  addMessage: (msg) => {
    const id = generateId();
    const message = { ...msg, id, createdAt: Date.now() };
    set((s) => {
      const newMessages = [...s.messages, message];
      let sessions = s.sessions;
      if (s.activeSessionId) {
        sessions = sessions.map((ses) =>
          ses.id === s.activeSessionId
            ? {
                ...ses,
                messages: newMessages,
                updatedAt: Date.now(),
                title: extractTitle(newMessages),
              }
            : ses
        );
      }
      return { messages: newMessages, sessions };
    });
    return id;
  },

  updateMessage: (id, content) => {
    set((s) => {
      const newMessages = s.messages.map((m) => (m.id === id ? { ...m, content } : m));
      let sessions = s.sessions;
      if (s.activeSessionId) {
        sessions = sessions.map((ses) =>
          ses.id === s.activeSessionId
            ? { ...ses, messages: newMessages, updatedAt: Date.now() }
            : ses
        );
      }
      return { messages: newMessages, sessions };
    });
  },

  setStreaming: (val) => set({ isStreaming: val }),

  finishStreaming: (id) => {
    set((s) => {
      const newMessages = s.messages.map((m) => (m.id === id ? { ...m, isStreaming: false } : m));
      let sessions = s.sessions;
      if (s.activeSessionId) {
        sessions = sessions.map((ses) =>
          ses.id === s.activeSessionId
            ? { ...ses, messages: newMessages, updatedAt: Date.now() }
            : ses
        );
      }
      return { messages: newMessages, sessions, isStreaming: false };
    });
    get().saveSessions();
  },

  clearMessages: () => {
    set((s) => ({
      messages: [],
      activeSessionId: null,
    }));
  },

  loadSessions: async () => {
    try {
      const data = await AsyncStorage.getItem('chat_sessions');
      if (data) {
        const sessions: ChatSession[] = JSON.parse(data);
        set({ sessions });
      }
    } catch {
      // ignore
    }
  },

  saveSessions: async () => {
    try {
      const sessions = get().sessions;
      await AsyncStorage.setItem('chat_sessions', JSON.stringify(sessions));
    } catch {
      // ignore
    }
  },
}));
