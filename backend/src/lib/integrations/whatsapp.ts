/**
 * Real WhatsApp Business API Integration
 * Provides actual functionality for WhatsApp messaging via Twilio
 */

export interface WhatsAppMessage {
  sid: string;
  accountSid: string;
  to: string;
  from: string;
  body: string;
  status: string;
  direction: string;
  dateCreated: string;
  dateSent: string | null;
  dateUpdated: string;
  price: string | null;
  priceUnit: string;
  errorCode: string | null;
  errorMessage: string | null;
  uri: string;
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  components: Array<{
    type: string;
    sub_type?: string;
    index?: string;
    parameters?: Array<{
      type: string;
      parameter_name?: string;
      text?: string;
    }>;
  }>;
}

export interface WhatsAppContact {
  wa_id: string;
  profile?: {
    name: string;
  };
}

export interface WhatsAppMedia {
  url: string;
  mimeType: string;
  fileSize?: number;
}

export class WhatsAppIntegration {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;
  private baseUrl = 'https://api.twilio.com/2010-04-01';

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
  }

  private async request<T>(method: string, path: string, params: Record<string, string> = {}): Promise<T> {
    const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
    
    const url = new URL(`${this.baseUrl}${path}`);
    if (method === 'GET' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: method !== 'GET' ? new URLSearchParams(params).toString() : undefined,
    });

    const data = await response.json();
    
    if (response.status >= 400) {
      throw new Error(`WhatsApp API Error: ${data.message || 'Unknown error'}`);
    }
    
    return data;
  }

  /**
   * Send a text message
   */
  async sendMessage(to: string, body: string): Promise<WhatsAppMessage> {
    return this.request<WhatsAppMessage>('POST', `/Accounts/${this.accountSid}/Messages.json`, {
      To: `whatsapp:${to}`,
      From: `whatsapp:${this.fromNumber}`,
      Body: body,
    });
  }

  /**
   * Send a media message
   */
  async sendMediaMessage(to: string, body: string, mediaUrl: string): Promise<WhatsAppMessage> {
    return this.request<WhatsAppMessage>('POST', `/Accounts/${this.accountSid}/Messages.json`, {
      To: `whatsapp:${to}`,
      From: `whatsapp:${this.fromNumber}`,
      Body: body,
      MediaUrl: mediaUrl,
    });
  }

  /**
   * Send a template message
   */
  async sendTemplateMessage(to: string, template: WhatsAppTemplate): Promise<WhatsAppMessage> {
    return this.request<WhatsAppMessage>('POST', `/Accounts/${this.accountSid}/Messages.json`, {
      To: `whatsapp:${to}`,
      From: `whatsapp:${this.fromNumber}`,
      MessagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID || '',
      Body: JSON.stringify(template),
    });
  }

  /**
   * Get message by SID
   */
  async getMessage(messageSid: string): Promise<WhatsAppMessage> {
    return this.request<WhatsAppMessage>('GET', `/Accounts/${this.accountSid}/Messages/${messageSid}.json`);
  }

  /**
   * List messages
   */
  async listMessages(to?: string, from?: string, limit = 20): Promise<WhatsAppMessage[]> {
    const params: Record<string, string> = { PageSize: limit.toString() };
    if (to) params.To = `whatsapp:${to}`;
    if (from) params.From = `whatsapp:${from}`;

    const data = await this.request<{ messages: WhatsAppMessage[] }>('GET', `/Accounts/${this.accountSid}/Messages.json`, params);
    return data.messages || [];
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.request<{ accountSid: string }>('GET', `/Accounts/${this.accountSid}.json`);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Create WhatsApp integration instance
 */
export function createWhatsAppIntegration(): WhatsAppIntegration | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.WHATSAPP_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return null;
  }

  return new WhatsAppIntegration(accountSid, authToken, fromNumber);
}
