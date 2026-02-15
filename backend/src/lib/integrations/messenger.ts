/**
 * Real Facebook Messenger API Integration
 * Provides actual functionality for Messenger messaging, webhooks, and page management
 */

export interface MessengerUser {
  id: string;
  first_name: string;
  last_name?: string;
  profile_pic?: string;
  gender?: string;
  locale?: string;
  timezone?: number;
}

export interface MessengerMessage {
  mid: string;
  seq: number;
  text?: string;
  attachments?: MessengerAttachment[];
  quick_reply?: {
    payload: string;
  };
  reply_to?: {
    mid: string;
  };
}

export interface MessengerAttachment {
  type: 'image' | 'audio' | 'video' | 'file' | 'fallback';
  payload?: {
    url?: string;
    template_type?: string;
    buttons?: MessengerButton[];
    elements?: unknown[];
  };
}

export interface MessengerButton {
  type: 'web_url' | 'postback' | 'phone_number' | 'account_link' | 'account_unlink';
  title?: string;
  url?: string;
  payload?: string;
  messenger_extensions?: boolean;
  webview_height_ratio?: string;
}

export interface MessengerSenderAction {
  recipient: { id: string };
  sender_action: 'typing_on' | 'typing_off' | 'mark_seen';
}

export interface MessengerQuickReply {
  content_type: 'text' | 'location';
  title?: string;
  image_url?: string;
  payload: string;
}

export interface MessengerTemplate {
  template_type: 'button' | 'generic' | 'list' | 'receipt' | 'airline';
  text?: string;
  buttons?: MessengerButton[];
  elements?: unknown[];
}

export interface MessengerWebhookEntry {
  id: string;
  time: number;
  messaging?: Array<{
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
    message?: MessengerMessage;
    postback?: {
      title: string;
      payload: string;
    };
    optin?: {
      ref: string;
    };
  }>;
}

export class MessengerIntegration {
  private pageAccessToken: string;
  private pageId: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(pageAccessToken: string, pageId: string) {
    this.pageAccessToken = pageAccessToken;
    this.pageId = pageId;
  }

  private async request<T>(method: string, endpoint: string, body?: Record<string, unknown>): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    if (method === 'GET' && body) {
      Object.entries(body as Record<string, string>).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Messenger API Error: ${data.error.message}`);
    }
    
    return data;
  }

  /**
   * Send a text message to a user
   */
  async sendMessage(recipientId: string, text: string, quickReplies?: MessengerQuickReply[]): Promise<{ message_id: string }> {
    const message: Record<string, unknown> = { text };

    if (quickReplies && quickReplies.length > 0) {
      message.quick_replies = quickReplies;
    }

    return this.request<{ message_id: string }>('POST', `me/messages`, {
      access_token: this.pageAccessToken,
      recipient: { id: recipientId },
      message,
    });
  }

  /**
   * Send an attachment (image, audio, video, file)
   */
  async sendAttachment(recipientId: string, type: 'image' | 'audio' | 'video' | 'file', url: string): Promise<{ message_id: string }> {
    return this.request('POST', `me/messages`, {
      access_token: this.pageAccessToken,
      recipient: { id: recipientId },
      message: {
        attachment: {
          type,
          payload: { url },
        },
      },
    });
  }

  /**
   * Send a template message
   */
  async sendTemplate(recipientId: string, template: MessengerTemplate): Promise<{ message_id: string }> {
    return this.request('POST', `me/messages`, {
      access_token: this.pageAccessToken,
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: 'template',
          payload: template,
        },
      },
    });
  }

  /**
   * Send buttons template
   */
  async sendButtons(recipientId: string, text: string, buttons: MessengerButton[]): Promise<{ message_id: string }> {
    return this.sendTemplate(recipientId, {
      template_type: 'button',
      text,
      buttons,
    });
  }

  /**
   * Send generic template (carousel)
   */
  async sendGenericTemplate(recipientId: string, elements: unknown[]): Promise<{ message_id: string }> {
    return this.sendTemplate(recipientId, {
      template_type: 'generic',
      elements,
    });
  }

  /**
   * Set typing indicator
   */
  async sendTypingIndicator(recipientId: string, typing: 'on' | 'off'): Promise<boolean> {
    const senderAction = typing === 'on' ? 'typing_on' : 'typing_off';
    
    await this.request('POST', `me/messages`, {
      access_token: this.pageAccessToken,
      recipient: { id: recipientId },
      sender_action: senderAction,
    });
    
    return true;
  }

  /**
   * Mark message as seen
   */
  async markSeen(recipientId: string): Promise<boolean> {
    await this.request('POST', `me/messages`, {
      access_token: this.pageAccessToken,
      recipient: { id: recipientId },
      sender_action: 'mark_seen',
    });
    
    return true;
  }

  /**
   * Get user profile information
   */
  async getUserProfile(userId: string): Promise<MessengerUser> {
    return this.request('GET', `${userId}`, {
      fields: 'first_name,last_name,profile_pic,gender,locale,timezone',
      access_token: this.pageAccessToken,
    });
  }

  /**
   * Create a webhook subscription
   */
  async createWebhook(callbackUrl: string, verifyToken: string): Promise<{ success: boolean }> {
    return this.request('POST', `${this.pageId}/subscriptions`, {
      access_token: this.pageAccessToken,
      object: 'page',
      callback_url: callbackUrl,
      verify_token: verifyToken,
      fields: 'messages,messaging_postbacks,messaging_optins,message_deliveries,message_reads',
    });
  }

  /**
   * Set up get started button
   */
  async setGetStartedButton(payload: string): Promise<boolean> {
    await this.request('POST', `me/messenger_profile`, {
      access_token: this.pageAccessToken,
      get_started: {
        payload,
      },
    });
    
    return true;
  }

  /**
   * Set up persistent menu
   */
  async setPersistentMenu(buttons: MessengerButton[]): Promise<boolean> {
    await this.request('POST', `me/messenger_profile`, {
      access_token: this.pageAccessToken,
      persistent_menu: [
        {
          locale: 'default',
          composer_input_disabled: false,
          buttons,
        },
      ],
    });
    
    return true;
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.request('GET', `me`, {
        access_token: this.pageAccessToken,
        fields: 'id,name',
      });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Create Messenger integration instance
 */
export function createMessengerIntegration(): MessengerIntegration | null {
  const pageAccessToken = process.env.MESSENGER_PAGE_ACCESS_TOKEN;
  const pageId = process.env.MESSENGER_PAGE_ID;

  if (!pageAccessToken || !pageId) {
    return null;
  }

  return new MessengerIntegration(pageAccessToken, pageId);
}
