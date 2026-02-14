/**
 * Real Twilio API Integration
 * Provides actual functionality for SMS, voice calls, and WhatsApp messaging
 */

export interface TwilioMessage {
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
  errorCode: string | null;
  errorMessage: string | null;
  price: string | null;
  priceUnit: string;
  numSegments: string;
  numMedia: string;
  messagingServiceSid: string | null;
  uri: string;
}

export interface TwilioCall {
  sid: string;
  accountSid: string;
  to: string;
  from: string;
  status: string;
  direction: string;
  dateCreated: string;
  dateUpdated: string;
  duration: string | null;
  price: string | null;
  priceUnit: string;
  startTime: string | null;
  endTime: string | null;
  forwardedFrom: string | null;
  callerName: string | null;
  uri: string;
}

export interface TwilioPhoneNumber {
  sid: string;
  accountSid: string;
  friendlyName: string;
  phoneNumber: string;
  smsUrl: string;
  smsMethod: string;
  voiceUrl: string;
  voiceMethod: string;
  capabilities: {
    sms: boolean;
    mms: boolean;
    voice: boolean;
  };
  status: string;
}

export interface TwilioAccount {
  sid: string;
  friendlyName: string;
  status: string;
  type: string;
  ownerAccountSid: string;
}

export interface TwilioRecording {
  sid: string;
  accountSid: string;
  callSid: string;
  duration: string;
  dateCreated: string;
  dateUpdated: string;
  status: string;
  channels: number;
  source: string;
  uri: string;
  mediaUrl: string;
}

export interface TwilioUsageRecord {
  accountSid: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  usage: string;
  usageUnit: string;
  count: string;
  countUnit: string;
  price: string;
  priceUnit: string;
}

export class TwilioIntegration {
  private accountSid: string;
  private authToken: string;
  private baseUrl: string;
  private fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber?: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`;
    this.fromNumber = fromNumber || '';
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
    return `Basic ${credentials}`;
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    params: Record<string, string> = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    if (method === 'POST' && Object.keys(params).length > 0) {
      options.body = new URLSearchParams(params).toString();
    }

    const response = await fetch(
      method === 'GET' && Object.keys(params).length > 0 
        ? `${url}?${new URLSearchParams(params)}` 
        : url,
      options
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Twilio API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Set the default from number
  setFromNumber(number: string): void {
    this.fromNumber = number;
  }

  // SMS Operations
  async sendSMS(
    to: string,
    body: string,
    options?: {
      from?: string;
      statusCallback?: string;
      validityPeriod?: number;
      maxPrice?: number;
      provideFeedback?: boolean;
    }
  ): Promise<TwilioMessage> {
    const params: Record<string, string> = {
      To: to,
      Body: body,
      From: options?.from || this.fromNumber,
    };

    if (options?.statusCallback) params.StatusCallback = options.statusCallback;
    if (options?.validityPeriod) params.ValidityPeriod = options.validityPeriod.toString();
    if (options?.maxPrice) params.MaxPrice = options.maxPrice.toString();
    if (options?.provideFeedback) params.ProvideFeedback = 'true';

    return this.request<TwilioMessage>('/Messages.json', 'POST', params);
  }

  async getSMS(messageSid: string): Promise<TwilioMessage> {
    return this.request<TwilioMessage>(`/Messages/${messageSid}.json`);
  }

  async listMessages(
    options?: {
      to?: string;
      from?: string;
      dateSentBefore?: string;
      dateSentAfter?: string;
      pageSize?: number;
    }
  ): Promise<{ messages: TwilioMessage[]; nextPageUri: string | null }> {
    const params: Record<string, string> = {};
    if (options?.to) params.To = options.to;
    if (options?.from) params.From = options.from;
    if (options?.dateSentBefore) params.DateSentBefore = options.dateSentBefore;
    if (options?.dateSentAfter) params.DateSentAfter = options.dateSentAfter;
    if (options?.pageSize) params.PageSize = options.pageSize.toString();

    return this.request<{ messages: TwilioMessage[]; nextPageUri: string | null }>('/Messages.json', 'GET', params);
  }

  // WhatsApp Operations
  async sendWhatsApp(
    to: string,
    body: string,
    options?: {
      from?: string;
      statusCallback?: string;
      mediaUrl?: string[];
    }
  ): Promise<TwilioMessage> {
    const params: Record<string, string> = {
      To: `whatsapp:${to}`,
      Body: body,
      From: `whatsapp:${options?.from || this.fromNumber}`,
    };

    if (options?.statusCallback) params.StatusCallback = options.statusCallback;
    if (options?.mediaUrl) params.MediaUrl = options.mediaUrl.join(',');

    return this.request<TwilioMessage>('/Messages.json', 'POST', params);
  }

  // Voice Call Operations
  async makeCall(
    to: string,
    url: string,
    options?: {
      from?: string;
      method?: 'GET' | 'POST';
      statusCallback?: string;
      statusCallbackEvent?: string[];
      timeout?: number;
      record?: boolean;
      callerId?: string;
    }
  ): Promise<TwilioCall> {
    const params: Record<string, string> = {
      To: to,
      Url: url,
      From: options?.from || this.fromNumber,
    };

    if (options?.method) params.Method = options.method;
    if (options?.statusCallback) params.StatusCallback = options.statusCallback;
    if (options?.statusCallbackEvent) params.StatusCallbackEvent = options.statusCallbackEvent.join(' ');
    if (options?.timeout) params.Timeout = options.timeout.toString();
    if (options?.record) params.Record = 'true';
    if (options?.callerId) params.CallerId = options.callerId;

    return this.request<TwilioCall>('/Calls.json', 'POST', params);
  }

  async getCall(callSid: string): Promise<TwilioCall> {
    return this.request<TwilioCall>(`/Calls/${callSid}.json`);
  }

  async listCalls(
    options?: {
      to?: string;
      from?: string;
      status?: string;
      startTimeBefore?: string;
      startTimeAfter?: string;
      pageSize?: number;
    }
  ): Promise<{ calls: TwilioCall[]; nextPageUri: string | null }> {
    const params: Record<string, string> = {};
    if (options?.to) params.To = options.to;
    if (options?.from) params.From = options.from;
    if (options?.status) params.Status = options.status;
    if (options?.startTimeBefore) params.StartTimeBefore = options.startTimeBefore;
    if (options?.startTimeAfter) params.StartTimeAfter = options.startTimeAfter;
    if (options?.pageSize) params.PageSize = options.pageSize.toString();

    return this.request<{ calls: TwilioCall[]; nextPageUri: string | null }>('/Calls.json', 'GET', params);
  }

  // Recording Operations
  async getRecordings(callSid?: string): Promise<{ recordings: TwilioRecording[] }> {
    const endpoint = callSid ? `/Calls/${callSid}/Recordings.json` : '/Recordings.json';
    return this.request<{ recordings: TwilioRecording[] }>(endpoint);
  }

  async getRecording(recordingSid: string): Promise<TwilioRecording> {
    return this.request<TwilioRecording>(`/Recordings/${recordingSid}.json`);
  }

  async deleteRecording(recordingSid: string): Promise<{ ok: boolean }> {
    await this.request(`/Recordings/${recordingSid}.json`, 'POST', { Status: 'deleted' });
    return { ok: true };
  }

  // Phone Number Operations
  async listPhoneNumbers(): Promise<{ incomingPhoneNumbers: TwilioPhoneNumber[] }> {
    return this.request<{ incomingPhoneNumbers: TwilioPhoneNumber[] }>('/IncomingPhoneNumbers.json');
  }

  async getPhoneNumber(phoneSid: string): Promise<TwilioPhoneNumber> {
    return this.request<TwilioPhoneNumber>(`/IncomingPhoneNumbers/${phoneSid}.json`);
  }

  async updatePhoneNumber(
    phoneSid: string,
    updates: {
      friendlyName?: string;
      smsUrl?: string;
      smsMethod?: string;
      voiceUrl?: string;
      voiceMethod?: string;
    }
  ): Promise<TwilioPhoneNumber> {
    const params: Record<string, string> = {};
    if (updates.friendlyName) params.FriendlyName = updates.friendlyName;
    if (updates.smsUrl) params.SmsUrl = updates.smsUrl;
    if (updates.smsMethod) params.SmsMethod = updates.smsMethod;
    if (updates.voiceUrl) params.VoiceUrl = updates.voiceUrl;
    if (updates.voiceMethod) params.VoiceMethod = updates.voiceMethod;

    return this.request<TwilioPhoneNumber>(`/IncomingPhoneNumbers/${phoneSid}.json`, 'POST', params);
  }

  // Account Operations
  async getAccount(): Promise<TwilioAccount> {
    return this.request<TwilioAccount>('.json');
  }

  // Usage Operations
  async getUsageRecords(
    category?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ usage_records: TwilioUsageRecord[] }> {
    const params: Record<string, string> = {};
    if (category) params.Category = category;
    if (startDate) params.StartDate = startDate;
    if (endDate) params.EndDate = endDate;

    return this.request<{ usage_records: TwilioUsageRecord[] }>('/Usage/Records.json', 'GET', params);
  }

  // TwiML Generation Helpers
  generateTwiML(verbs: Array<{ name: string; attributes?: Record<string, string>; content?: string }>): string {
    let twiml = '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n';
    
    for (const verb of verbs) {
      const attrs = verb.attributes 
        ? ' ' + Object.entries(verb.attributes).map(([k, v]) => `${k}="${v}"`).join(' ')
        : '';
      
      if (verb.content) {
        twiml += `  <${verb.name}${attrs}>${verb.content}</${verb.name}>\n`;
      } else {
        twiml += `  <${verb.name}${attrs}/>\n`;
      }
    }
    
    twiml += '</Response>';
    return twiml;
  }

  // Common TwiML responses
  sayResponse(text: string, language: string = 'en-US', voice: string = 'alice'): string {
    return this.generateTwiML([
      { name: 'Say', attributes: { language, voice }, content: text }
    ]);
  }

  playResponse(url: string): string {
    return this.generateTwiML([
      { name: 'Play', attributes: { loop: '1' }, content: url }
    ]);
  }

  gatherResponse(
    action: string,
    sayText: string,
    numDigits?: number,
    timeout: number = 5
  ): string {
    const gatherAttrs: Record<string, string> = { action, method: 'POST', timeout: timeout.toString() };
    if (numDigits) gatherAttrs.numDigits = numDigits.toString();

    return this.generateTwiML([
      { name: 'Gather', attributes: gatherAttrs, content: '' },
      { name: 'Say', content: sayText }
    ]);
  }

  dialResponse(number: string, callerId?: string): string {
    const attrs: Record<string, string> = {};
    if (callerId) attrs.callerId = callerId;
    
    return this.generateTwiML([
      { name: 'Dial', attributes: attrs, content: number }
    ]);
  }

  hangupResponse(): string {
    return this.generateTwiML([
      { name: 'Hangup' }
    ]);
  }

  redirectResponse(url: string): string {
    return this.generateTwiML([
      { name: 'Redirect', content: url }
    ]);
  }
}

// Factory function for creating Twilio integration instance
export function createTwilioIntegration(
  accountSid?: string,
  authToken?: string,
  fromNumber?: string
): TwilioIntegration | null {
  const sid = accountSid || process.env.TWILIO_ACCOUNT_SID;
  const token = authToken || process.env.TWILIO_AUTH_TOKEN;
  const number = fromNumber || process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token) {
    console.warn('Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.');
    return null;
  }

  return new TwilioIntegration(sid, token, number);
}