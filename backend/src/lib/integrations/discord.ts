/**
 * Real Discord API Integration
 * Provides actual functionality for Discord messaging, webhooks, and bot management
 */

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
  splash?: string;
  owner_id: string;
  region?: string;
  explicit_content_filter: number;
  features: string[];
}

export interface DiscordChannel {
  id: string;
  type: number;
  guild_id?: string;
  name: string;
  position?: number;
  permission_overwrites?: unknown[];
  topic?: string;
  nsfw?: boolean;
  last_message_id?: string;
}

export interface DiscordMessage {
  id: string;
  channel_id: string;
  author: DiscordUser;
  content: string;
  timestamp: string;
  edited_timestamp?: string;
  tts: boolean;
  mention_everyone: boolean;
  mentions: DiscordUser[];
  mention_roles: string[];
  attachments: Array<{
    id: string;
    filename: string;
    size: number;
    url: string;
    proxy_url: string;
  }>;
  embeds: Array<{
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: { text: string; icon_url?: string };
    image?: { url: string; proxy_url?: string };
    thumbnail?: { url: string; proxy_url?: string };
    author?: { name: string; icon_url?: string; url?: string };
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
  }>;
}

export interface DiscordWebhook {
  id: string;
  type: number;
  guild_id: string;
  channel_id: string;
  name: string;
  avatar?: string;
  token?: string;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: {
    text: string;
    icon_url?: string;
  };
  image?: {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  };
  thumbnail?: {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
}

export class DiscordIntegration {
  private botToken: string;
  private baseUrl = 'https://discord.com/api/v10';

  constructor(botToken: string) {
    this.botToken = botToken;
  }

  private async request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bot ${this.botToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    if (response.status >= 400) {
      throw new Error(`Discord API Error: ${data.message || 'Unknown error'}`);
    }
    
    return data;
  }

  /**
   * Get current bot user
   */
  async getCurrentUser(): Promise<DiscordUser> {
    return this.request<DiscordUser>('GET', '/users/@me');
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<DiscordUser> {
    return this.request<DiscordUser>('GET', `/users/${userId}`);
  }

  /**
   * Get guild
   */
  async getGuild(guildId: string): Promise<DiscordGuild> {
    return this.request<DiscordGuild>('GET', `/guilds/${guildId}`);
  }

  /**
   * Get channel
   */
  async getChannel(channelId: string): Promise<DiscordChannel> {
    return this.request<DiscordChannel>('GET', `/channels/${channelId}`);
  }

  /**
   * Send message to channel
   */
  async sendMessage(channelId: string, content: string, embeds?: DiscordEmbed[]): Promise<DiscordMessage> {
    return this.request<DiscordMessage>('POST', `/channels/${channelId}/messages`, {
      content,
      embeds,
    });
  }

  /**
   * Send embed message
   */
  async sendEmbed(channelId: string, embed: DiscordEmbed): Promise<DiscordMessage> {
    return this.sendMessage(channelId, '', [embed]);
  }

  /**
   * Send file
   */
  async sendFile(channelId: string, file: { name: string; data: Blob }, content?: string): Promise<DiscordMessage> {
    const formData = new FormData();
    formData.append('file', file.data, file.name);
    if (content) {
      formData.append('content', content);
    }

    const response = await fetch(`${this.baseUrl}/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${this.botToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(`Discord API Error: ${data.message || 'Unknown error'}`);
    }
    return data;
  }

  /**
   * Edit message
   */
  async editMessage(channelId: string, messageId: string, content: string, embeds?: DiscordEmbed[]): Promise<DiscordMessage> {
    return this.request<DiscordMessage>('PATCH', `/channels/${channelId}/messages/${messageId}`, {
      content,
      embeds,
    });
  }

  /**
   * Delete message
   */
  async deleteMessage(channelId: string, messageId: string): Promise<boolean> {
    await this.request('DELETE', `/channels/${channelId}/messages/${messageId}`);
    return true;
  }

  /**
   * Create webhook
   */
  async createWebhook(channelId: string, name: string, avatar?: string): Promise<DiscordWebhook> {
    return this.request<DiscordWebhook>('POST', `/channels/${channelId}/webhooks`, {
      name,
      avatar,
    });
  }

  /**
   * Send webhook message
   */
  async sendWebhookMessage(webhookId: string, webhookToken: string, content: string, embeds?: DiscordEmbed[]): Promise<DiscordMessage> {
    const response = await fetch(`${this.baseUrl}/webhooks/${webhookId}/${webhookToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        embeds,
      }),
    });

    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(`Discord API Error: ${data.message || 'Unknown error'}`);
    }
    return data;
  }

  /**
   * Get guild channels
   */
  async getGuildChannels(guildId: string): Promise<DiscordChannel[]> {
    return this.request<DiscordChannel[]>('GET', `/guilds/${guildId}/channels`);
  }

  /**
   * Create reaction
   */
  async createReaction(channelId: string, messageId: string, emoji: string): Promise<boolean> {
    await this.request('PUT', `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`);
    return true;
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Create Discord integration instance
 */
export function createDiscordIntegration(): DiscordIntegration | null {
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    return null;
  }

  return new DiscordIntegration(botToken);
}
