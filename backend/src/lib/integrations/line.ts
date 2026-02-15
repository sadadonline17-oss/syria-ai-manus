/**
 * Real LINE Messaging API Integration
 * Provides actual functionality for LINE messaging, webhooks, and bot management
 */

export interface LINEUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export type LINEMessage = 
  | LINETextMessage 
  | LINEImageMessage 
  | LINEVideoMessage 
  | LINEAudioMessage 
  | LINEFileMessage 
  | LINELocationMessage 
  | LINEStickerMessage 
  | LINETemplateMessage;

export interface LINETextMessage {
  type: 'text';
  text: string;
  emojis?: Array<{
    index: number;
    productId: string;
    emojiId: string;
  }>;
  quickReply?: {
    items: LINEQuickReplyItem[];
  };
}

export interface LINEImageMessage {
  type: 'image';
  originalContentUrl: string;
  previewImageUrl: string;
}

export interface LINEVideoMessage {
  type: 'video';
  originalContentUrl: string;
  previewImageUrl: string;
  trackingId?: string;
}

export interface LINEAudioMessage {
  type: 'audio';
  originalContentUrl: string;
  duration: number;
}

export interface LINEFileMessage {
  type: 'file';
  fileName: string;
  fileSize: number;
}

export interface LINELocationMessage {
  type: 'location';
  title: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface LINEStickerMessage {
  type: 'sticker';
  packageId: string;
  stickerId: string;
  stickerResourceType?: 'MESSAGE' | 'EC' | 'ANIMATION' | 'ANIMATION_SOUND' | 'POPUP' | 'CUSTOM';
}

export interface LINETemplateMessage {
  type: 'template';
  altText: string;
  template: LINETemplate;
}

export interface LINEQuickReplyItem {
  type: 'action';
  action: LINEAction;
  imageUrl?: string;
}

export type LINEAction =
  | { type: 'postback'; label: string; data: string; displayText?: string }
  | { type: 'message'; label: string; text: string }
  | { type: 'uri'; label: string; uri: string }
  | { type: 'datetimepicker'; label: string; data: string; mode: 'date' | 'time' | 'datetime'; initial?: string; max?: string; min?: string };

export type LINETemplate = LINEButtonsTemplate | LINECarouselTemplate | LINEImageCarouselTemplate | LINEConfirmTemplate;

export interface LINEButtonsTemplate {
  type: 'buttons';
  thumbnailImageUrl?: string;
  title?: string;
  text: string;
  defaultAction?: LINEAction;
  actions: LINEAction[];
}

export interface LINECarouselTemplate {
  type: 'carousel';
  columns: LINECarouselColumn[];
  imageAspectRatio?: 'rectangle' | 'square';
  imageSize?: 'cover' | 'contain';
}

export interface LINECarouselColumn {
  thumbnailImageUrl?: string;
  title?: string;
  text: string;
  defaultAction?: LINEAction;
  actions: LINEAction[];
}

export interface LINEImageCarouselTemplate {
  type: 'image_carousel';
  columns: LINEImageCarouselColumn[];
}

export interface LINEImageCarouselColumn {
  imageUrl: string;
  action: LINEAction;
}

export interface LINEConfirmTemplate {
  type: 'confirm';
  text: string;
  actions: LINEAction[];
}

export interface LINEWebhookEvent {
  type: 'message' | 'follow' | 'unfollow' | 'join' | 'leave' | 'memberjoin' | 'memberleave' | 'postback' | 'beacon' | 'accountlink' | 'things';
  mode: 'active' | 'standby';
  timestamp: number;
  source: {
    type: 'user' | 'group' | 'room';
    userId?: string;
    groupId?: string;
    roomId?: string;
  };
  webhookEventId: string;
  delivery?: {
    messageIds: string[];
  };
  message?: {
    id: string;
    type: string;
    text?: string;
    fileName?: string;
    fileSize?: number;
  };
  postback?: {
    data: string;
    params?: unknown;
  };
  beacon?: {
    type: string;
    hwid: string;
    dm?: string;
  };
}

export class LINEIntegration {
  private channelAccessToken: string;
  private channelSecret: string;
  private baseUrl = 'https://api.line.me/v2';
  private botBaseUrl = 'https://api.line.me/v2/bot';

  constructor(channelAccessToken: string, channelSecret: string) {
    this.channelAccessToken = channelAccessToken;
    this.channelSecret = channelSecret;
  }

  private async request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.botBaseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.channelAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`LINE API Error: ${data.error.message}`);
    }
    
    return data;
  }

  /**
   * Send a push message to a user
   */
  async pushMessage(userId: string, messages: LINEMessage | LINEMessage[]): Promise<{ messageId: string }> {
    const messageArray = Array.isArray(messages) ? messages : [messages];
    
    return this.request<{ messageId: string }>('POST', '/message/push', {
      to: userId,
      messages: messageArray,
    });
  }

  /**
   * Send a reply message
   */
  async replyMessage(replyToken: string, messages: LINEMessage | LINEMessage[]): Promise<{ messageId: string }> {
    const messageArray = Array.isArray(messages) ? messages : [messages];
    
    return this.request<{ messageId: string }>('POST', '/message/reply', {
      replyToken,
      messages: messageArray,
    });
  }

  /**
   * Send text message
   */
  async sendText(userId: string, text: string, quickReply?: LINEQuickReplyItem[]): Promise<{ messageId: string }> {
    const message: LINETextMessage = { type: 'text', text };
    if (quickReply) {
      message.quickReply = { items: quickReply };
    }
    return this.pushMessage(userId, message);
  }

  /**
   * Send image
   */
  async sendImage(userId: string, imageUrl: string, previewUrl?: string): Promise<{ messageId: string }> {
    return this.pushMessage(userId, {
      type: 'image',
      originalContentUrl: imageUrl,
      previewImageUrl: previewUrl || imageUrl,
    });
  }

  /**
   * Send video
   */
  async sendVideo(userId: string, videoUrl: string, previewUrl: string): Promise<{ messageId: string }> {
    return this.pushMessage(userId, {
      type: 'video',
      originalContentUrl: videoUrl,
      previewImageUrl: previewUrl,
    });
  }

  /**
   * Send audio
   */
  async sendAudio(userId: string, audioUrl: string, duration: number): Promise<{ messageId: string }> {
    return this.pushMessage(userId, {
      type: 'audio',
      originalContentUrl: audioUrl,
      duration,
    });
  }

  /**
   * Send location
   */
  async sendLocation(userId: string, title: string, address: string, latitude: number, longitude: number): Promise<{ messageId: string }> {
    return this.pushMessage(userId, {
      type: 'location',
      title,
      address,
      latitude,
      longitude,
    });
  }

  /**
   * Send sticker
   */
  async sendSticker(userId: string, packageId: string, stickerId: string): Promise<{ messageId: string }> {
    return this.pushMessage(userId, {
      type: 'sticker',
      packageId,
      stickerId,
    });
  }

  /**
   * Send buttons template
   */
  async sendButtonsTemplate(userId: string, altText: string, template: LINEButtonsTemplate): Promise<{ messageId: string }> {
    return this.pushMessage(userId, {
      type: 'template',
      altText,
      template,
    });
  }

  /**
   * Send carousel template
   */
  async sendCarouselTemplate(userId: string, altText: string, columns: LINECarouselColumn[]): Promise<{ messageId: string }> {
    return this.pushMessage(userId, {
      type: 'template',
      altText,
      template: {
        type: 'carousel',
        columns,
      },
    });
  }

  /**
   * Send confirm template
   */
  async sendConfirmTemplate(userId: string, altText: string, text: string, actions: LINEAction[]): Promise<{ messageId: string }> {
    return this.pushMessage(userId, {
      type: 'template',
      altText,
      template: {
        type: 'confirm',
        text,
        actions,
      },
    });
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<LINEUser> {
    return this.request<LINEUser>('GET', `/profile/${userId}`);
  }

  /**
   * Get group member profile
   */
  async getGroupMemberProfile(groupId: string, userId: string): Promise<LINEUser> {
    return this.request<LINEUser>('GET', `/group/${groupId}/member/${userId}`);
  }

  /**
   * Get room member profile
   */
  async getRoomMemberProfile(roomId: string, userId: string): Promise<LINEUser> {
    return this.request<LINEUser>('GET', `/room/${roomId}/member/${userId}`);
  }

  /**
   * Leave group
   */
  async leaveGroup(groupId: string): Promise<boolean> {
    await this.request('POST', `/group/${groupId}/leave`);
    return true;
  }

  /**
   * Leave room
   */
  async leaveRoom(roomId: string): Promise<boolean> {
    await this.request('POST', `/room/${roomId}/leave`);
    return true;
  }

  /**
   * Set webhook URL
   */
  async setWebhookEndpoint(endpoint: string): Promise<boolean> {
    await this.request('PUT', '/webhook/endpoint', {
      endpoint,
    });
    return true;
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.request<{ endpoint: string }>('GET', '/info');
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Create LINE integration instance
 */
export function createLINEIntegration(): LINEIntegration | null {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  if (!channelAccessToken || !channelSecret) {
    return null;
  }

  return new LINEIntegration(channelAccessToken, channelSecret);
}
