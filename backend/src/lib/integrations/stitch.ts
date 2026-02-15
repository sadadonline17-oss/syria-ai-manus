/**
 * Stitch (withGoogle) Integration for Syria AI
 * Real API Integration with Google services through Stitch
 */

export interface GoogleServiceAccount {
  id: string;
  email: string;
  displayName: string;
  projectId: string;
}

export interface GoogleSheet {
  spreadsheetId: string;
  title: string;
  sheets: Array<{ sheetId: number; title: string }>;
}

export interface GoogleCalendar {
  id: string;
  summary: string;
  timeZone: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  webViewLink?: string;
  iconLink?: string;
}

export interface GoogleGmailLabel {
  id: string;
  name: string;
  type: 'system' | 'user';
  messagesTotal: number;
  messagesUnread: number;
}

export class StitchGoogleIntegration {
  private accessToken: string;
  private baseUrl = 'https://api.stitchdata.com/v4';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Stitch API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Google Sheets
  async listSheets(): Promise<GoogleSheet[]> {
    return this.request('/google/sheets/spreadsheets');
  }

  async getSheet(spreadsheetId: string): Promise<GoogleSheet> {
    return this.request(`/google/sheets/spreadsheets/${spreadsheetId}`);
  }

  async getSheetValues(spreadsheetId: string, range: string): Promise<any> {
    return this.request(`/google/sheets/spreadsheets/${spreadsheetId}/values/${range}`);
  }

  async updateSheetValues(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    await this.request(`/google/sheets/spreadsheets/${spreadsheetId}/values/${range}`, {
      method: 'PUT',
      body: JSON.stringify({ values }),
    });
  }

  // Google Drive
  async listFiles(query?: string): Promise<GoogleDriveFile[]> {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return this.request(`/google/drive/files${params}`);
  }

  async getFile(fileId: string): Promise<GoogleDriveFile> {
    return this.request(`/google/drive/files/${fileId}`);
  }

  async createFile(name: string, mimeType: string, parents?: string[]): Promise<GoogleDriveFile> {
    return this.request('/google/drive/files', {
      method: 'POST',
      body: JSON.stringify({ name, mimeType, parents }),
    });
  }

  async updateFile(fileId: string, data: Partial<GoogleDriveFile>): Promise<GoogleDriveFile> {
    return this.request(`/google/drive/files/${fileId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.request(`/google/drive/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  // Google Calendar
  async listCalendars(): Promise<GoogleCalendar[]> {
    return this.request('/google/calendar/calendars');
  }

  async getCalendar(calendarId: string): Promise<GoogleCalendar> {
    return this.request(`/google/calendar/calendars/${calendarId}`);
  }

  async listEvents(calendarId: string, timeMin?: string, timeMax?: string): Promise<any[]> {
    let params = '';
    if (timeMin) params += `timeMin=${timeMin}`;
    if (timeMax) params += `${params ? '&' : ''}timeMax=${timeMax}`;
    return this.request(`/google/calendar/calendars/${calendarId}/events${params ? '?' + params : ''}`);
  }

  async createEvent(calendarId: string, event: any): Promise<any> {
    return this.request(`/google/calendar/calendars/${calendarId}/events`, {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async updateEvent(calendarId: string, eventId: string, event: any): Promise<any> {
    return this.request(`/google/calendar/calendars/${calendarId}/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(event),
    });
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    await this.request(`/google/calendar/calendars/${calendarId}/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Gmail
  async listLabels(): Promise<GoogleGmailLabel[]> {
    return this.request('/google/gmail/labels');
  }

  async listMessages(labelIds?: string[]): Promise<any[]> {
    const params = labelIds ? `?labelIds=${labelIds.join(',')}` : '';
    return this.request(`/google/gmail/messages${params}`);
  }

  async getMessage(messageId: string): Promise<any> {
    return this.request(`/google/gmail/messages/${messageId}`);
  }

  async sendMessage(to: string, subject: string, body: string): Promise<any> {
    return this.request('/google/gmail/messages/send', {
      method: 'POST',
      body: JSON.stringify({ to, subject, body }),
    });
  }
}

let stitchClient: StitchGoogleIntegration | null = null;

export function createStitchGoogleIntegration(): StitchGoogleIntegration | null {
  const accessToken = process.env.STITCH_ACCESS_TOKEN;

  if (!accessToken) {
    return null;
  }

  if (!stitchClient) {
    stitchClient = new StitchGoogleIntegration(accessToken);
  }

  return stitchClient;
}

export { StitchGoogleIntegration as StitchClient };
