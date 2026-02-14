/**
 * Netlify Integration for Syria AI
 * Real API Integration with Netlify
 */

import { createHonoClient } from '../lib/utils';

export interface NetlifySite {
  id: string;
  name: string;
  url: string;
  admin_url: string;
  ssl_url: string;
  ssl?: boolean;
  published_deploy: NetlifyDeploy | null;
  created_at: string;
  updated_at: string;
}

export interface NetlifyDeploy {
  id: string;
  state: 'ready' | 'building' | 'error' | 'pending';
  branch: string;
  commit_ref: string;
  deploy_time: number;
  commit_message: string;
}

export interface NetlifyBuild {
  id: string;
  site_id: string;
  state: 'pending' | 'building' | 'ready' | 'error' | ' canceled';
  branch: string;
  commit_ref: string;
  created_at: string;
  updated_at: string;
  deployed_at?: string;
}

export interface NetlifyFunction {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  current_bucket: string;
  examples: string[];
}

export class NetlifyIntegration {
  private apiKey: string;
  private accountId: string;
  private baseUrl = 'https://api.netlify.com/api/v1';

  constructor(apiKey: string, accountId: string) {
    this.apiKey = apiKey;
    this.accountId = accountId;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.statusText}`);
    }

    return response.json();
  }

  async listSites(): Promise<NetlifySite[]> {
    return this.request(`/sites`);
  }

  async getSite(siteId: string): Promise<NetlifySite> {
    return this.request(`/sites/${siteId}`);
  }

  async createSite(site: { name?: string; repo?: { repo_url: string } }): Promise<NetlifySite> {
    return this.request(`/sites`, {
      method: 'POST',
      body: JSON.stringify(site),
    });
  }

  async deleteSite(siteId: string): Promise<void> {
    await this.request(`/sites/${siteId}`, { method: 'DELETE' });
  }

  async listDeploys(siteId: string): Promise<NetlifyDeploy[]> {
    return this.request(`/sites/${siteId}/deploys`);
  }

  async getDeploy(siteId: string, deployId: string): Promise<NetlifyDeploy> {
    return this.request(`/sites/${siteId}/deploys/${deployId}`);
  }

  async createDeploy(siteId: string, deploy: { branch: string; draft?: boolean }): Promise<NetlifyDeploy> {
    return this.request(`/sites/${siteId}/deploys`, {
      method: 'POST',
      body: JSON.stringify(deploy),
    });
  }

  async cancelDeploy(siteId: string, deployId: string): Promise<NetlifyDeploy> {
    return this.request(`/sites/${siteId}/deploys/${deployId}/cancel`, {
      method: 'POST',
    });
  }

  async listBuilds(siteId: string): Promise<NetlifyBuild[]> {
    return this.request(`/sites/${siteId}/builds`);
  }

  async triggerBuild(siteId: string, branch: string): Promise<NetlifyBuild> {
    return this.request(`/sites/${siteId}/builds`, {
      method: 'POST',
      body: JSON.stringify({ branch }),
    });
  }

  async listFunctions(siteId: string): Promise<NetlifyFunction[]> {
    return this.request(`/sites/${siteId}/functions`);
  }

  async getFunction(siteId: string, functionName: string): Promise<NetlifyFunction> {
    return this.request(`/sites/${siteId}/functions/${functionName}`);
  }

  async getAccount(): Promise<{ id: string; email: string; full_name: string; avatar_url: string }> {
    return this.request(`/accounts/${this.accountId}`);
  }

  async listAccountSites(): Promise<NetlifySite[]> {
    return this.request(`/accounts/${this.accountId}/sites`);
  }
}

let netlifyClient: NetlifyIntegration | null = null;

export function createNetlifyIntegration(): NetlifyIntegration | null {
  const apiKey = process.env.NETLIFY_API_KEY;
  const accountId = process.env.NETLIFY_ACCOUNT_ID;

  if (!apiKey || !accountId) {
    return null;
  }

  if (!netlifyClient) {
    netlifyClient = new NetlifyIntegration(apiKey, accountId);
  }

  return netlifyClient;
}

export { NetlifyIntegration as NetlifyClient };
