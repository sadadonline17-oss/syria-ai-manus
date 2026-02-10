import { create } from 'zustand';

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
  addConnector: (connector: MCPConnector) => void;
  removeConnector: (id: string) => void;
  updateConnectorStatus: (id: string, status: MCPConnectionStatus) => void;
  setActiveConnector: (id: string | null) => void;
  toggleConnection: (id: string) => void;
}

const DEMO_CONNECTORS: MCPConnector[] = [
  {
    id: 'openai', name: 'OpenAI', description: 'GPT-4, DALL-E, Whisper',
    icon: 'brain', status: 'connected', transport: 'sse',
    endpoint: 'https://api.openai.com/v1', capabilities: ['chat', 'image', 'audio', 'embeddings'],
    lastPing: Date.now() - 1200, category: 'ai',
  },
  {
    id: 'supabase', name: 'Supabase', description: 'قاعدة بيانات، Auth، Storage',
    icon: 'database', status: 'connected', transport: 'sse',
    endpoint: 'https://xxx.supabase.co', capabilities: ['database', 'auth', 'storage', 'realtime'],
    lastPing: Date.now() - 800, category: 'data',
  },
  {
    id: 'github', name: 'GitHub', description: 'مستودعات، Issues، Actions',
    icon: 'git', status: 'connected', transport: 'sse',
    capabilities: ['repos', 'issues', 'actions', 'pulls'], category: 'dev',
  },
  {
    id: 'slack', name: 'Slack', description: 'رسائل، قنوات، إشعارات',
    icon: 'message', status: 'disconnected', transport: 'websocket',
    capabilities: ['messages', 'channels', 'notifications'], category: 'comm',
  },
  {
    id: 'stripe', name: 'Stripe', description: 'مدفوعات، اشتراكات، فواتير',
    icon: 'credit', status: 'pending', transport: 'sse',
    capabilities: ['payments', 'subscriptions', 'invoices'], category: 'cloud',
  },
  {
    id: 'twilio', name: 'Twilio', description: 'SMS، مكالمات، WhatsApp',
    icon: 'phone', status: 'disconnected', transport: 'sse',
    capabilities: ['sms', 'voice', 'whatsapp'], category: 'comm',
  },
  {
    id: 'vercel', name: 'Vercel', description: 'نشر، Domains، Analytics',
    icon: 'cloud', status: 'disconnected', transport: 'sse',
    capabilities: ['deploy', 'domains', 'analytics'], category: 'cloud',
  },
  {
    id: 'anthropic', name: 'Anthropic', description: 'Claude 3.5, Claude 3 Opus',
    icon: 'brain', status: 'connected', transport: 'sse',
    capabilities: ['chat', 'analysis', 'code'], category: 'ai',
  },
];

const DEMO_TOOLS: MCPTool[] = [
  { name: 'search_web', description: 'بحث في الويب', inputSchema: { query: 'string' }, connectorId: 'openai' },
  { name: 'query_database', description: 'استعلام قاعدة البيانات', inputSchema: { sql: 'string' }, connectorId: 'supabase' },
  { name: 'create_issue', description: 'إنشاء Issue', inputSchema: { title: 'string', body: 'string' }, connectorId: 'github' },
  { name: 'send_message', description: 'إرسال رسالة', inputSchema: { channel: 'string', text: 'string' }, connectorId: 'slack' },
];

export const useMCPStore = create<MCPState>((set, get) => ({
  connectors: DEMO_CONNECTORS,
  tools: DEMO_TOOLS,
  resources: [],
  activeConnectorId: null,

  addConnector: (connector) => set((s) => ({ connectors: [...s.connectors, connector] })),
  removeConnector: (id) => set((s) => ({ connectors: s.connectors.filter((c) => c.id !== id) })),
  updateConnectorStatus: (id, status) =>
    set((s) => ({
      connectors: s.connectors.map((c) => (c.id === id ? { ...c, status, lastPing: status === 'connected' ? Date.now() : c.lastPing } : c)),
    })),
  setActiveConnector: (id) => set({ activeConnectorId: id }),
  toggleConnection: (id) => {
    const connector = get().connectors.find((c) => c.id === id);
    if (!connector) return;
    const newStatus: MCPConnectionStatus = connector.status === 'connected' ? 'disconnected' : connector.status === 'disconnected' ? 'pending' : connector.status === 'pending' ? 'connected' : 'disconnected';
    get().updateConnectorStatus(id, newStatus);
    if (newStatus === 'pending') {
      setTimeout(() => get().updateConnectorStatus(id, 'connected'), 1500);
    }
  },
}));
