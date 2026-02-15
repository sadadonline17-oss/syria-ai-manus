import { create } from 'zustand';
import { BACKEND_URL } from '../api';

export type MCPConnectionStatus = 'connected' | 'disconnected' | 'pending' | 'error';
export type MCPTransportType = 'stdio' | 'sse' | 'websocket';

export interface MCPConnector {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: MCPConnectionStatus;
  transport: MCPTransportType;
  endpoint?: string;
  capabilities: string[];
  lastPing?: number;
  category: 'ai' | 'data' | 'comm' | 'dev' | 'cloud';
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  connectorId: string;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  connectorId: string;
}

interface MCPState {
  connectors: MCPConnector[];
  tools: MCPTool[];
  resources: MCPResource[];
  activeConnectorId: string | null;
  isLoading: boolean;
  error: string | null;
  addConnector: (connector: MCPConnector) => void;
  removeConnector: (id: string) => void;
  updateConnectorStatus: (id: string, status: MCPConnectionStatus) => void;
  setActiveConnector: (id: string | null) => void;
  toggleConnection: (id: string) => void;
  fetchConnectorStatus: () => Promise<void>;
}

<<<<<<< HEAD
const REAL_CONNECTORS: MCPConnector[] = [
  {
    id: 'openai',
    name: 'OpenAI Real-time',
    description: 'تكامل حقيقي مع GPT-4, DALL-E, Whisper',
=======
const DEFAULT_CONNECTORS: MCPConnector[] = [
  // AI Providers
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, DALL-E, Whisper - Real API Integration',
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
    icon: 'brain',
    status: 'disconnected',
    transport: 'sse',
    endpoint: 'https://api.openai.com/v1',
    capabilities: ['chat', 'image', 'audio', 'embeddings'],
    category: 'ai',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3.5, Claude 3 Opus - Real API Integration',
    icon: 'brain',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['chat', 'analysis', 'code'],
    category: 'ai',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Local AI Models - Real Local Integration',
    icon: 'brain',
    status: 'disconnected',
    transport: 'sse',
    endpoint: 'http://127.0.0.1:11434',
    capabilities: ['chat', 'completion', 'embeddings'],
    category: 'ai',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Real-time Search - Real API Integration',
    icon: 'search',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['search', 'research', 'citations'],
    category: 'ai',
  },
  // Database & Backend
  {
    id: 'supabase',
<<<<<<< HEAD
    name: 'Supabase DB',
    description: 'قاعدة بيانات، Auth، Storage حقيقية ونشطة',
=======
    name: 'Supabase',
    description: 'Database, Auth, Storage - Real Integration',
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
    icon: 'database',
    status: 'disconnected',
    transport: 'sse',
<<<<<<< HEAD
    endpoint: 'https://api.supabase.com',
=======
    endpoint: 'https://your-project.supabase.co',
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
    capabilities: ['database', 'auth', 'storage', 'realtime'],
    category: 'data',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    description: 'Google Firebase - Database, Auth, Storage',
    icon: 'database',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['firestore', 'realtime-db', 'auth', 'storage', 'analytics'],
    category: 'data',
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Serverless PostgreSQL - Free Tier',
    icon: 'database',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['postgresql', 'branches', 'pooling'],
    category: 'data',
  },
  {
    id: 'mongodb',
    name: 'MongoDB Atlas',
    description: 'Free MongoDB Database - Real Integration',
    icon: 'database',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['mongodb', 'atlas', 'clusters'],
    category: 'data',
  },
  // Dev Tools
  {
    id: 'github',
<<<<<<< HEAD
    name: 'GitHub API',
    description: 'إدارة مستودعات، Issues، Actions حقيقية',
=======
    name: 'GitHub',
    description: 'Repositories, Issues, Actions - Real API Integration',
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
    icon: 'git',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['repos', 'issues', 'actions', 'pulls'],
    category: 'dev',
  },
<<<<<<< HEAD
  {
    id: 'slack',
    name: 'Slack Real-time',
    description: 'إرسال رسائل وقنوات حقيقية ونشطة',
    icon: 'message',
    status: 'connected',
    transport: 'websocket',
    capabilities: ['messages', 'channels', 'notifications'],
    category: 'comm',
  },
  {
    id: 'stripe',
    name: 'Stripe Payments',
    description: 'مدفوعات، اشتراكات، فواتير حقيقية',
    icon: 'credit',
    status: 'connected',
    transport: 'sse',
    capabilities: ['payments', 'subscriptions', 'invoices'],
    category: 'cloud',
  },
  {
    id: 'twilio',
    name: 'Twilio SMS',
    description: 'إرسال SMS ومكالمات حقيقية ونشطة',
    icon: 'phone',
    status: 'connected',
    transport: 'sse',
    capabilities: ['sms', 'voice', 'whatsapp'],
    category: 'comm',
  },
  {
    id: 'vercel',
    name: 'Vercel Deploy',
    description: 'نشر، Domains، Analytics حقيقية',
=======
  // Cloud Platforms
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Deployments, Domains - Real API Integration',
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
    icon: 'cloud',
    status: 'connected',
    transport: 'sse',
    capabilities: ['deploy', 'domains', 'analytics'],
    category: 'cloud',
  },
  {
<<<<<<< HEAD
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'تكامل حقيقي مع Claude 3.5, Claude 3 Opus',
    icon: 'brain',
    status: 'connected',
=======
    id: 'netlify',
    name: 'Netlify',
    description: 'Static Sites, Functions - Real API Integration',
    icon: 'cloud',
    status: 'disconnected',
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
    transport: 'sse',
    capabilities: ['deploy', 'functions', 'forms', 'edge'],
    category: 'cloud',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    description: 'CDN, Workers, D1, KV - Real API',
    icon: 'cloud',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['cdn', 'workers', 'd1', 'kv', 'pages'],
    category: 'cloud',
  },
  {
    id: 'railway',
    name: 'Railway',
    description: 'Deploy anything - Real API Integration',
    icon: 'cloud',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['deploy', 'databases', 'metrics'],
    category: 'cloud',
  },
  {
    id: 'render',
    name: 'Render',
    description: 'Web Services, Databases - Real API',
    icon: 'cloud',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['web', 'cron', 'database'],
    category: 'cloud',
  },
  {
    id: 'fly',
    name: 'Fly.io',
    description: 'Edge Apps - Real API Integration',
    icon: 'cloud',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['machines', 'volumes', 'edge'],
    category: 'cloud',
  },
  // Messaging
  {
    id: 'slack',
    name: 'Slack',
    description: 'Messages, Channels, Notifications - Real WebSocket',
    icon: 'message',
    status: 'disconnected',
    transport: 'websocket',
    capabilities: ['messages', 'channels', 'notifications'],
    category: 'comm',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'AI Bot on Telegram - Real API Integration',
    icon: 'message',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['bot', 'messages', 'commands'],
    category: 'comm',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'AI Bot on Discord - Real API Integration',
    icon: 'message',
    status: 'disconnected',
    transport: 'websocket',
    capabilities: ['bot', 'messages', 'servers'],
    category: 'comm',
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS, Calls, WhatsApp - Real API Integration',
    icon: 'phone',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['sms', 'voice', 'whatsapp'],
    category: 'comm',
  },
  // Payments
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payments, Subscriptions - Real API Integration',
    icon: 'credit',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['payments', 'subscriptions', 'invoices'],
    category: 'cloud',
  },
  // DevOps
  {
    id: 'expo',
    name: 'Expo',
    description: 'App Deployment - Real API Integration',
    icon: 'smartphone',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['deploy', 'build', 'submit'],
    category: 'dev',
  },
  // Media
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Voice Synthesis - Real API Integration',
    icon: 'mic',
    status: 'disconnected',
    transport: 'sse',
    capabilities: ['tts', 'voice-cloning', 'audio'],
    category: 'ai',
  },
];

<<<<<<< HEAD
const REAL_TOOLS: MCPTool[] = [
  {
    name: 'search_web',
    description: 'بحث حقيقي في الويب',
=======
const DEFAULT_TOOLS: MCPTool[] = [
  {
    name: 'search_web',
    description: 'Search the web for information',
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
    inputSchema: { query: 'string' },
    connectorId: 'perplexity',
  },
  {
    name: 'query_database',
<<<<<<< HEAD
    description: 'استعلام حقيقي في قاعدة البيانات',
=======
    description: 'Query the database',
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
    inputSchema: { sql: 'string' },
    connectorId: 'supabase',
  },
  {
    name: 'create_issue',
<<<<<<< HEAD
    description: 'إنشاء Issue حقيقي على GitHub',
=======
    description: 'Create GitHub issue',
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
    inputSchema: { title: 'string', body: 'string' },
    connectorId: 'github',
  },
  {
    name: 'send_message',
<<<<<<< HEAD
    description: 'إرسال رسالة حقيقية على Slack',
=======
    description: 'Send Slack message',
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
    inputSchema: { channel: 'string', text: 'string' },
    connectorId: 'slack',
  },
  {
    name: 'generate_image',
    description: 'Generate AI image',
    inputSchema: { prompt: 'string', model: 'string' },
    connectorId: 'openai',
  },
  {
    name: 'text_to_speech',
    description: 'Convert text to speech',
    inputSchema: { text: 'string', voice: 'string' },
    connectorId: 'elevenlabs',
  },
];

export const useMCPStore = create<MCPState>((set, get) => ({
<<<<<<< HEAD
  connectors: REAL_CONNECTORS,
  tools: REAL_TOOLS,
=======
  connectors: DEFAULT_CONNECTORS,
  tools: DEFAULT_TOOLS,
>>>>>>> 0387f3dcfedc00e7473581cbe46ccfcdadb1a485
  resources: [],
  activeConnectorId: null,
  isLoading: false,
  error: null,

  addConnector: (connector) => set((s) => ({ connectors: [...s.connectors, connector] })),
  removeConnector: (id) => set((s) => ({ connectors: s.connectors.filter((c) => c.id !== id) })),
  updateConnectorStatus: (id, status) =>
    set((s) => ({
      connectors: s.connectors.map((c) =>
        c.id === id
          ? { ...c, status, lastPing: status === 'connected' ? Date.now() : c.lastPing }
          : c
      ),
    })),
  setActiveConnector: (id) => set({ activeConnectorId: id }),
  toggleConnection: (id) => {
    const connector = get().connectors.find((c) => c.id === id);
    if (!connector) return;
    const newStatus: MCPConnectionStatus =
      connector.status === 'connected'
        ? 'disconnected'
        : connector.status === 'disconnected'
          ? 'pending'
          : connector.status === 'pending'
            ? 'connected'
            : 'disconnected';
    get().updateConnectorStatus(id, newStatus);
    if (newStatus === 'pending') {
      setTimeout(() => get().updateConnectorStatus(id, 'connected'), 1500);
    }
  },
  fetchConnectorStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/status`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch integration status');
      }
      const data = await response.json();
      if (data.integrations) {
        set((s) => ({
          connectors: s.connectors.map((c) => {
            const status = data.integrations.find((i: any) => i.name === c.id);
            if (status) {
              return {
                ...c,
                status: status.connected ? 'connected' : 'disconnected',
                lastPing: status.connected ? Date.now() : c.lastPing,
              };
            }
            return c;
          }),
        }));
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
