/**
 * Real Vercel API Integration
 * Provides actual functionality for deployments, domains, and analytics
 */

export interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  framework: string | null;
  createdAt: number;
  updatedAt: number;
  link: {
    type: string;
    repo: string;
    org: string;
  } | null;
  targets: Record<string, { id: string; alias: string[] }>;
}

export interface VercelDeployment {
  id: string;
  name: string;
  url: string;
  state: string;
  createdAt: number;
  readyState: string;
  target: string | null;
  projectId: string;
  meta: {
    githubCommitSha?: string;
    githubCommitMessage?: string;
    githubCommitAuthorName?: string;
  };
  alias: string[];
}

export interface VercelDomain {
  id: string;
  name: string;
  apexName: string;
  verified: boolean;
  verification: Array<{
    type: string;
    domain: string;
    value: string;
    reason: string;
  }>;
  createdAt: number;
  updatedAt: number;
}

export interface VercelEnvVariable {
  id: string;
  key: string;
  value: string;
  type: 'encrypted' | 'plain' | 'sensitive';
  target: ('production' | 'preview' | 'development')[];
  projectId: string;
  createdAt: number;
  updatedAt: number;
}

export interface VercelLog {
  id: string;
  type: string;
  created: number;
  text: string;
  info: {
    host: string;
    pid: number;
    requestId: string;
    region: string;
    timestamp: number;
  };
}

export interface VercelUser {
  id: string;
  username: string;
  email: string;
  name: string | null;
  avatar: string | null;
}

export interface VercelTeam {
  id: string;
  slug: string;
  name: string;
  avatar: string | null;
}

export class VercelIntegration {
  private token: string;
  private baseUrl = 'https://api.vercel.com';
  private teamId?: string;

  constructor(token: string, teamId?: string) {
    this.token = token;
    this.teamId = teamId;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
    return headers;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: any
  ): Promise<T> {
    const url = this.teamId
      ? `${this.baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}teamId=${this.teamId}`
      : `${this.baseUrl}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (body && (method === 'POST' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vercel API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // User Operations
  async getCurrentUser(): Promise<{ user: VercelUser }> {
    return this.request('GET', '/v2/user');
  }

  // Team Operations
  async listTeams(): Promise<{ teams: VercelTeam[] }> {
    return this.request('GET', '/v2/teams');
  }

  async getTeam(teamId: string): Promise<{ team: VercelTeam }> {
    return this.request('GET', `/v2/teams/${teamId}`);
  }

  // Project Operations
  async listProjects(limit: number = 100): Promise<{ projects: VercelProject[] }> {
    return this.request('GET', `/v9/projects?limit=${limit}`);
  }

  async getProject(projectId: string): Promise<{ project: VercelProject }> {
    return this.request('GET', `/v9/projects/${projectId}`);
  }

  async createProject(params: {
    name: string;
    framework?: string;
    gitRepository?: {
      type: 'github' | 'gitlab' | 'bitbucket';
      repo: string;
    };
    environmentVariables?: Array<{
      key: string;
      value: string;
      target: ('production' | 'preview' | 'development')[];
      type: 'encrypted' | 'plain' | 'sensitive';
    }>;
  }): Promise<{ project: VercelProject }> {
    return this.request('POST', '/v9/projects', params);
  }

  async updateProject(
    projectId: string,
    params: {
      name?: string;
      framework?: string;
      buildCommand?: string;
      outputDirectory?: string;
      installCommand?: string;
      devCommand?: string;
    }
  ): Promise<{ project: VercelProject }> {
    return this.request('PATCH', `/v9/projects/${projectId}`, params);
  }

  async deleteProject(projectId: string): Promise<{ status: string }> {
    return this.request('DELETE', `/v9/projects/${projectId}`);
  }

  // Deployment Operations
  async listDeployments(
    projectId?: string,
    limit: number = 20
  ): Promise<{ deployments: VercelDeployment[] }> {
    const endpoint = projectId
      ? `/v13/deployments?projectId=${projectId}&limit=${limit}`
      : `/v13/deployments?limit=${limit}`;
    return this.request('GET', endpoint);
  }

  async getDeployment(deploymentId: string): Promise<{ deployment: VercelDeployment }> {
    return this.request('GET', `/v13/deployments/${deploymentId}`);
  }

  async createDeployment(params: {
    name: string;
    files: Array<{ file: string; data: string }>;
    framework?: string;
    projectSettings?: {
      buildCommand?: string;
      outputDirectory?: string;
      installCommand?: string;
    };
    target?: 'production' | 'preview';
    projectId?: string;
  }): Promise<{ deployment: VercelDeployment }> {
    return this.request('POST', '/v13/deployments', params);
  }

  async cancelDeployment(deploymentId: string): Promise<{ deployment: VercelDeployment }> {
    return this.request('PATCH', `/v13/deployments/${deploymentId}/cancel`);
  }

  async redeploy(deploymentId: string, params?: {
    target?: 'production' | 'preview';
  }): Promise<{ deployment: VercelDeployment }> {
    return this.request('POST', `/v13/deployments/${deploymentId}/redeploy`, params);
  }

  // Domain Operations
  async listDomains(): Promise<{ domains: VercelDomain[] }> {
    return this.request('GET', '/v5/domains');
  }

  async getDomain(domainName: string): Promise<{ domain: VercelDomain }> {
    return this.request('GET', `/v5/domains/${domainName}`);
  }

  async addDomain(domainName: string, projectId?: string): Promise<{ domain: VercelDomain }> {
    return this.request('POST', '/v5/domains', {
      name: domainName,
      projectId,
    });
  }

  async verifyDomain(domainName: string): Promise<{ domain: VercelDomain }> {
    return this.request('POST', `/v5/domains/${domainName}/verify`);
  }

  async removeDomain(domainName: string): Promise<{ status: string }> {
    return this.request('DELETE', `/v5/domains/${domainName}`);
  }

  async addDomainToProject(
    projectId: string,
    domainName: string
  ): Promise<{ verified: boolean; domain: VercelDomain }> {
    return this.request('POST', `/v9/projects/${projectId}/domains`, {
      name: domainName,
    });
  }

  // Environment Variables Operations
  async listEnvVariables(projectId: string): Promise<{ envs: VercelEnvVariable[] }> {
    return this.request('GET', `/v9/projects/${projectId}/env`);
  }

  async getEnvVariable(projectId: string, envId: string): Promise<{ env: VercelEnvVariable }> {
    return this.request('GET', `/v9/projects/${projectId}/env/${envId}`);
  }

  async createEnvVariable(
    projectId: string,
    params: {
      key: string;
      value: string;
      target: ('production' | 'preview' | 'development')[];
      type: 'encrypted' | 'plain' | 'sensitive';
    }
  ): Promise<{ created: VercelEnvVariable }> {
    return this.request('POST', `/v9/projects/${projectId}/env`, params);
  }

  async updateEnvVariable(
    projectId: string,
    envId: string,
    params: {
      value: string;
      target: ('production' | 'preview' | 'development')[];
    }
  ): Promise<{ env: VercelEnvVariable }> {
    return this.request('PATCH', `/v9/projects/${projectId}/env/${envId}`, params);
  }

  async deleteEnvVariable(projectId: string, envId: string): Promise<{ status: string }> {
    return this.request('DELETE', `/v9/projects/${projectId}/env/${envId}`);
  }

  // Logs Operations
  async getDeploymentLogs(
    deploymentId: string,
    options?: {
      since?: number;
      until?: number;
      direction?: 'forward' | 'backward';
      follow?: boolean;
    }
  ): Promise<{ logs: VercelLog[] }> {
    const params = new URLSearchParams();
    if (options?.since) params.append('since', options.since.toString());
    if (options?.until) params.append('until', options.until.toString());
    if (options?.direction) params.append('direction', options.direction);
    if (options?.follow) params.append('follow', 'true');

    const queryString = params.toString();
    const endpoint = `/v2/deployments/${deploymentId}/events${queryString ? `?${queryString}` : ''}`;
    return this.request('GET', endpoint);
  }

  // Analytics Operations
  async getProjectAnalytics(
    projectId: string,
    options?: {
      from?: number;
      to?: number;
      granularity?: 'hour' | 'day' | 'week' | 'month';
    }
  ): Promise<{
    analytics: {
      pageViews: Array<{ timestamp: number; value: number }>;
      uniqueVisitors: Array<{ timestamp: number; value: number }>;
      bandwidth: Array<{ timestamp: number; value: number }>;
      requests: Array<{ timestamp: number; value: number }>;
    };
  }> {
    const params = new URLSearchParams();
    if (options?.from) params.append('from', options.from.toString());
    if (options?.to) params.append('to', options.to.toString());
    if (options?.granularity) params.append('granularity', options.granularity);

    const queryString = params.toString();
    const endpoint = `/v1/projects/${projectId}/analytics${queryString ? `?${queryString}` : ''}`;
    return this.request('GET', endpoint);
  }

  // File Operations
  async uploadFile(
    projectId: string,
    file: { name: string; content: string }
  ): Promise<{ file: { id: string; name: string } }> {
    return this.request('POST', '/v2/files', {
      projectId,
      name: file.name,
      content: file.content,
    });
  }

  // Webhook Operations
  async createWebhook(
    projectId: string,
    events: string[],
    url: string
  ): Promise<{ webhook: { id: string; url: string; events: string[] } }> {
    return this.request('POST', `/v1/projects/${projectId}/webhooks`, {
      events,
      url,
    });
  }

  async listWebhooks(projectId: string): Promise<{ webhooks: Array<{ id: string; url: string; events: string[] }> }> {
    return this.request('GET', `/v1/projects/${projectId}/webhooks`);
  }

  async deleteWebhook(projectId: string, webhookId: string): Promise<{ status: string }> {
    return this.request('DELETE', `/v1/projects/${projectId}/webhooks/${webhookId}`);
  }
}

// Factory function for creating Vercel integration instance
export function createVercelIntegration(token?: string, teamId?: string): VercelIntegration | null {
  const vercelToken = token || process.env.VERCEL_TOKEN;
  const vercelTeamId = teamId || process.env.VERCEL_TEAM_ID;

  if (!vercelToken) {
    console.warn('Vercel token not configured. Set VERCEL_TOKEN environment variable.');
    return null;
  }

  return new VercelIntegration(vercelToken, vercelTeamId);
}