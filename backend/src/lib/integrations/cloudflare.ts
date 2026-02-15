/**
 * Cloudflare Integration for Syria AI
 * Real API Integration with Cloudflare
 */

export interface CloudflareZone {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'initializing' | 'moved';
  paused: boolean;
  type: 'full' | 'partial';
  development_mode: number;
  name_servers: string[];
}

export interface CloudflareDNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  lockable: boolean;
  zone_id: string;
  zone_name: string;
}

export interface CloudflareWorker {
  id: string;
  script_name: string;
  digest: string;
  etag: string;
  size: number;
  modified_on: string;
  created_on: string;
}

export interface CloudflarePage {
  id: string;
  name: string;
  domains: string[];
  created_on: string;
  modified_on: string;
}

export interface CloudflareD1Database {
  uuid: string;
  name: string;
  created_at: string;
  version: string;
  size_in_bytes: number;
  num_tables: number;
}

export interface CloudflareKVNamespace {
  id: string;
  title: string;
  supports_url_encoding: boolean;
}

export class CloudflareIntegration {
  private apiToken: string;
  private accountId: string;
  private baseUrl = 'https://api.cloudflare.com/client/v4';

  constructor(apiToken: string, accountId: string) {
    this.apiToken = apiToken;
    this.accountId = accountId;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(`Cloudflare API error: ${JSON.stringify(data.errors)}`);
    }

    return data.result;
  }

  // Zones
  async listZones(): Promise<CloudflareZone[]> {
    return this.request(`/zones`);
  }

  async getZone(zoneId: string): Promise<CloudflareZone> {
    return this.request(`/zones/${zoneId}`);
  }

  // DNS Records
  async listDNSRecords(zoneId: string, type?: string): Promise<CloudflareDNSRecord[]> {
    const params = type ? `?type=${type}` : '';
    return this.request(`/zones/${zoneId}/dns_records${params}`);
  }

  async createDNSRecord(zoneId: string, record: {
    type: string;
    name: string;
    content: string;
    ttl?: number;
    proxied?: boolean;
  }): Promise<CloudflareDNSRecord> {
    return this.request(`/zones/${zoneId}/dns_records`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async updateDNSRecord(zoneId: string, recordId: string, record: {
    type: string;
    name: string;
    content: string;
    ttl?: number;
    proxied?: boolean;
  }): Promise<CloudflareDNSRecord> {
    return this.request(`/zones/${zoneId}/dns_records/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify(record),
    });
  }

  async deleteDNSRecord(zoneId: string, recordId: string): Promise<void> {
    await this.request(`/zones/${zoneId}/dns_records/${recordId}`, {
      method: 'DELETE',
    });
  }

  // Workers
  async listWorkers(): Promise<CloudflareWorker[]> {
    return this.request(`/accounts/${this.accountId}/workers/scripts`);
  }

  async getWorker(scriptName: string): Promise<CloudflareWorker> {
    return this.request(`/accounts/${this.accountId}/workers/scripts/${scriptName}`);
  }

  async uploadWorker(scriptName: string, script: string): Promise<void> {
    await this.request(`/accounts/${this.accountId}/workers/scripts/${scriptName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'text/javascript' },
      body: script,
    });
  }

  async deleteWorker(scriptName: string): Promise<void> {
    await this.request(`/accounts/${this.accountId}/workers/scripts/${scriptName}`, {
      method: 'DELETE',
    });
  }

  // Pages
  async listPages(): Promise<CloudflarePage[]> {
    return this.request(`/accounts/${this.accountId}/pages/projects`);
  }

  async getPage(projectName: string): Promise<CloudflarePage> {
    return this.request(`/accounts/${this.accountId}/pages/projects/${projectName}`);
  }

  // D1 Databases
  async listD1Databases(): Promise<CloudflareD1Database[]> {
    return this.request(`/accounts/${this.accountId}/d1/databases`);
  }

  async createD1Database(name: string): Promise<CloudflareD1Database> {
    return this.request(`/accounts/${this.accountId}/d1/databases`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async deleteD1Database(uuid: string): Promise<void> {
    await this.request(`/accounts/${this.accountId}/d1/databases/${uuid}`, {
      method: 'DELETE',
    });
  }

  // KV Namespaces
  async listKVNamespaces(): Promise<CloudflareKVNamespace[]> {
    return this.request(`/accounts/${this.accountId}/storage/kv/namespaces`);
  }

  async createKVNamespace(title: string): Promise<CloudflareKVNamespace> {
    return this.request(`/accounts/${this.accountId}/storage/kv/namespaces`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async deleteKVNamespace(id: string): Promise<void> {
    await this.request(`/accounts/${this.accountId}/storage/kv/namespaces/${id}`, {
      method: 'DELETE',
    });
  }

  // Account
  async getAccount(): Promise<{ id: string; name: string; created_on: string }> {
    return this.request(`/accounts/${this.accountId}`);
  }
}

let cloudflareClient: CloudflareIntegration | null = null;

export function createCloudflareIntegration(): CloudflareIntegration | null {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken || !accountId) {
    return null;
  }

  if (!cloudflareClient) {
    cloudflareClient = new CloudflareIntegration(apiToken, accountId);
  }

  return cloudflareClient;
}

export { CloudflareIntegration as CloudflareClient };
