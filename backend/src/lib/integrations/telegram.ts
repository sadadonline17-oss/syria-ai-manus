/**
 * Real Telegram API Integration
 * Provides actual functionality for bot messaging, updates, and webhooks
 */

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
  inline_query?: TelegramInlineQuery;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  photo?: TelegramPhoto[];
  document?: TelegramDocument;
  voice?: TelegramVoice;
  video?: TelegramVideo;
  location?: TelegramLocation;
  contact?: TelegramContact;
  entities?: TelegramMessageEntity[];
  reply_to_message?: TelegramMessage;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramPhoto {
  file_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface TelegramDocument {
  file_id: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramVoice {
  file_id: string;
  duration: number;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramVideo {
  file_id: string;
  width: number;
  height: number;
  duration: number;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramLocation {
  longitude: number;
  latitude: number;
}

export interface TelegramContact {
  phone_number: string;
  first_name: string;
  last_name?: string;
  user_id?: number;
}

export interface TelegramMessageEntity {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUser;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
  chat_instance: string;
}

export interface TelegramInlineQuery {
  id: string;
  from: TelegramUser;
  query: string;
  offset: string;
}

export interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
}

export class TelegramIntegration {
  private token: string;
  private baseUrl = 'https://api.telegram.org';

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}/bot${this.token}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Telegram API Error: ${data.description}`);
    }
    
    return data.result;
  }

  /**
   * Get bot information
   */
  async getMe(): Promise<TelegramBotInfo> {
    return this.request<TelegramBotInfo>('getMe');
  }

  /**
   * Send a text message
   */
  async sendMessage(chatId: number, text: string, parseMode?: 'Markdown' | 'HTML', replyMarkup?: unknown): Promise<TelegramMessage> {
    return this.request<TelegramMessage>('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      reply_markup: replyMarkup,
    });
  }

  /**
   * Send a photo
   */
  async sendPhoto(chatId: number, photo: string, caption?: string): Promise<TelegramMessage> {
    return this.request<TelegramMessage>('sendPhoto', {
      chat_id: chatId,
      photo,
      caption,
    });
  }

  /**
   * Send a document
   */
  async sendDocument(chatId: number, document: string, caption?: string): Promise<TelegramMessage> {
    return this.request<TelegramMessage>('sendDocument', {
      chat_id: chatId,
      document,
      caption,
    });
  }

  /**
   * Send a voice message
   */
  async sendVoice(chatId: number, voice: string, caption?: string): Promise<TelegramMessage> {
    return this.request<TelegramMessage>('sendVoice', {
      chat_id: chatId,
      voice,
      caption,
    });
  }

  /**
   * Set a webhook
   */
  async setWebhook(url: string, certificate?: string): Promise<boolean> {
    return this.request<boolean>('setWebhook', {
      url,
      certificate,
    });
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(): Promise<boolean> {
    return this.request<boolean>('deleteWebhook');
  }

  /**
   * Get webhook info
   */
  async getWebhookInfo(): Promise<{ url: string; has_custom_certificate: boolean; pending_update_count: number }> {
    return this.request('getWebhookInfo');
  }

  /**
   * Get updates
   */
  async getUpdates(offset?: number, limit?: number): Promise<TelegramUpdate[]> {
    return this.request<TelegramUpdate[]>('getUpdates', {
      offset,
      limit,
    });
  }

  /**
   * Create an invite link for a chat
   */
  async exportChatInviteLink(chatId: number): Promise<string> {
    return this.request<string>('exportChatInviteLink', {
      chat_id: chatId,
    });
  }

  /**
   * Get chat administrators
   */
  async getChatAdministrators(chatId: number): Promise<Array<TelegramUser & { status: string }>> {
    return this.request('getChatAdministrators', { chat_id: chatId });
  }

  /**
   * Get chat member count
   */
  async getChatMemberCount(chatId: number): Promise<number> {
    return this.request<number>('getChatMemberCount', { chat_id: chatId });
  }

  /**
   * Get file
   */
  async getFile(fileId: string): Promise<{ file_id: string; file_size: number; file_path: string }> {
    return this.request('getFile', { file_id: fileId });
  }

  /**
   * Answer callback query
   */
  async answerCallbackQuery(callbackQueryId: string, text?: string, showAlert?: boolean): Promise<boolean> {
    return this.request<boolean>('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert,
    });
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getMe();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Create Telegram integration instance
 */
export function createTelegramIntegration(): TelegramIntegration | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return null;
  }
  return new TelegramIntegration(token);
}
