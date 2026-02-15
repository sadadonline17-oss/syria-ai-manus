/**
 * Real Slack API Integration
 * Provides actual functionality for messages, channels, and notifications via WebSocket
 */

export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  is_member: boolean;
  num_members: number;
  topic: { value: string };
  purpose: { value: string };
}

export interface SlackMessage {
  ts: string;
  type: string;
  subtype?: string;
  user?: string;
  text: string;
  channel: string;
  thread_ts?: string;
  attachments?: Array<{
    id: number;
    title: string;
    text: string;
    fallback: string;
  }>;
  files?: Array<{
    id: string;
    name: string;
    mimetype: string;
    url_private: string;
  }>;
}

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  display_name: string;
  email: string;
  profile: {
    image_72: string;
    image_192: string;
    status_text: string;
    status_emoji: string;
  };
  is_online: boolean;
}

export interface SlackTeam {
  id: string;
  name: string;
  domain: string;
  icon: { image_132: string };
}

export class SlackIntegration {
  private token: string;
  private baseUrl = 'https://slack.com/api';
  private wsConnection: WebSocket | null = null;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(method: string, params: Record<string, string> = {}): Promise<T> {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseUrl}/${method}?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Slack API Error: ${data.error}`);
    }

    return data;
  }

  private async post<T>(method: string, body: Record<string, any>): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${method}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Slack API Error: ${data.error}`);
    }

    return data;
  }

  // Authentication & Connection
  async testConnection(): Promise<{ url: string; team: string; user: string }> {
    const result = await this.request<{ url: string; team: { name: string }; user: string }>('auth.test');
    return {
      url: result.url,
      team: result.team.name,
      user: result.user,
    };
  }

  // Channel Operations
  async listChannels(excludeArchived: boolean = true): Promise<{ channels: SlackChannel[] }> {
    return this.request<{ channels: SlackChannel[] }>('conversations.list', {
      exclude_archived: excludeArchived ? 'true' : 'false',
      limit: '200',
    });
  }

  async getChannelInfo(channelId: string): Promise<{ channel: SlackChannel }> {
    return this.request<{ channel: SlackChannel }>('conversations.info', { channel: channelId });
  }

  async createChannel(name: string, isPrivate: boolean = false): Promise<{ channel: SlackChannel }> {
    return this.post<{ channel: SlackChannel }>('conversations.create', {
      name,
      is_private: isPrivate,
    });
  }

  async joinChannel(channelId: string): Promise<{ channel: SlackChannel }> {
    return this.request<{ channel: SlackChannel }>('conversations.join', { channel: channelId });
  }

  async leaveChannel(channelId: string): Promise<{ channel: SlackChannel }> {
    return this.request<{ channel: SlackChannel }>('conversations.leave', { channel: channelId });
  }

  // Message Operations
  async postMessage(
    channel: string,
    text: string,
    options?: {
      thread_ts?: string;
      blocks?: any[];
      attachments?: any[];
      unfurl_links?: boolean;
      unfurl_media?: boolean;
    }
  ): Promise<{ ts: string; channel: string; message: SlackMessage }> {
    return this.post<{ ts: string; channel: string; message: SlackMessage }>('chat.postMessage', {
      channel,
      text,
      ...options,
    });
  }

  async postEphemeral(
    channel: string,
    user: string,
    text: string,
    options?: { thread_ts?: string; blocks?: any[] }
  ): Promise<{ message_ts: string }> {
    return this.post<{ message_ts: string }>('chat.postEphemeral', {
      channel,
      user,
      text,
      ...options,
    });
  }

  async updateMessage(
    channel: string,
    ts: string,
    text: string,
    options?: { blocks?: any[]; attachments?: any[] }
  ): Promise<{ ts: string; channel: string; text: string }> {
    return this.post<{ ts: string; channel: string; text: string }>('chat.update', {
      channel,
      ts,
      text,
      ...options,
    });
  }

  async deleteMessage(channel: string, ts: string): Promise<{ ok: boolean }> {
    return this.post<{ ok: boolean }>('chat.delete', { channel, ts });
  }

  async getConversationHistory(
    channel: string,
    options?: { oldest?: string; latest?: string; limit?: number }
  ): Promise<{ messages: SlackMessage[]; has_more: boolean }> {
    const params: Record<string, string> = { channel: channel };
    if (options?.oldest) params.oldest = options.oldest;
    if (options?.latest) params.latest = options.latest;
    if (options?.limit) params.limit = options.limit.toString();
    return this.request<{ messages: SlackMessage[]; has_more: boolean }>('conversations.history', params);
  }

  async getThreadReplies(channel: string, threadTs: string): Promise<{ messages: SlackMessage[] }> {
    return this.request<{ messages: SlackMessage[] }>('conversations.replies', {
      channel,
      ts: threadTs,
    });
  }

  // User Operations
  async listUsers(): Promise<{ members: SlackUser[] }> {
    return this.request<{ members: SlackUser[] }>('users.list');
  }

  async getUserInfo(userId: string): Promise<{ user: SlackUser }> {
    return this.request<{ user: SlackUser }>('users.info', { user: userId });
  }

  async getUserByEmail(email: string): Promise<{ user: SlackUser }> {
    return this.request<{ user: SlackUser }>('users.lookupByEmail', { email });
  }

  // Reaction Operations
  async addReaction(channel: string, name: string, timestamp: string): Promise<{ ok: boolean }> {
    return this.post<{ ok: boolean }>('reactions.add', {
      channel,
      name,
      timestamp,
    });
  }

  async removeReaction(channel: string, name: string, timestamp: string): Promise<{ ok: boolean }> {
    return this.post<{ ok: boolean }>('reactions.remove', {
      channel,
      name,
      timestamp,
    });
  }

  // File Operations
  async uploadFile(
    channels: string[],
    file: { name: string; content: string; filetype: string },
    options?: { title?: string; initial_comment?: string; thread_ts?: string }
  ): Promise<{ file: { id: string; name: string; url_private: string } }> {
    const formData = new FormData();
    formData.append('channels', channels.join(','));
    formData.append('filename', file.name);
    formData.append('filetype', file.filetype);
    formData.append('content', file.content);
    if (options?.title) formData.append('title', options.title);
    if (options?.initial_comment) formData.append('initial_comment', options.initial_comment);
    if (options?.thread_ts) formData.append('thread_ts', options.thread_ts);

    const response = await fetch(`${this.baseUrl}/files.upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Slack API Error: ${data.error}`);
    }
    return data;
  }

  // Search
  async searchMessages(query: string): Promise<{ messages: { matches: SlackMessage[] } }> {
    return this.request<{ messages: { matches: SlackMessage[] } }>('search.messages', {
      query,
      count: '20',
    });
  }

  // Real-Time Messaging (RTM) - WebSocket Connection
  async connectRTM(): Promise<{ url: string }> {
    const result = await this.request<{ url: string }>('rtm.connect');
    return result;
  }

  async startRTM(onMessage: (event: any) => void): Promise<void> {
    const { url } = await this.connectRTM();
    
    this.wsConnection = new WebSocket(url);
    
    this.wsConnection.onopen = () => {
      console.log('[Slack RTM] Connected to WebSocket');
    };
    
    this.wsConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data.toString());
        onMessage(data);
      } catch (error) {
        console.error('[Slack RTM] Error parsing message:', error);
      }
    };
    
    this.wsConnection.onerror = (error) => {
      console.error('[Slack RTM] WebSocket error:', error);
    };
    
    this.wsConnection.onclose = () => {
      console.log('[Slack RTM] WebSocket closed');
      this.wsConnection = null;
    };
  }

  disconnectRTM(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  isRTMConnected(): boolean {
    return this.wsConnection !== null && this.wsConnection.readyState === WebSocket.OPEN;
  }

  // Team Info
  async getTeamInfo(): Promise<{ team: SlackTeam }> {
    return this.request<{ team: SlackTeam }>('team.info');
  }
}

// Factory function for creating Slack integration instance
export function createSlackIntegration(token?: string): SlackIntegration | null {
  const slackToken = token || process.env.SLACK_BOT_TOKEN;
  if (!slackToken) {
    console.warn('Slack token not configured. Set SLACK_BOT_TOKEN environment variable.');
    return null;
  }
  return new SlackIntegration(slackToken);
}