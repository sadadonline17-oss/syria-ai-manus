/**
 * Real Expo EAS API Integration
 * Provides actual functionality for building, publishing, and managing Expo apps
 */

export interface ExpoProject {
  id: string;
  name: string;
  slug: string;
  owner: string;
  platform: 'ios' | 'android' | 'all';
}

export interface ExpoBuild {
  id: string;
  projectId: string;
  status: 'pending' | 'in-progress' | 'finished' | 'errored';
  platform: 'ios' | 'android';
  runtimeVersion?: string;
  sdkVersion?: string;
  appVersion?: string;
  buildPhase?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  artifacts?: {
    buildUrl?: string;
    logsUrl?: string;
  };
}

export interface ExpoSubmission {
  id: string;
  projectId: string;
  status: 'pending' | 'in-progress' | 'finished' | 'errored';
  platform: 'ios' | 'android';
  submittedAt: string;
  completedAt?: string;
  storeUrl?: string;
}

export interface ExpoUpdate {
  id: string;
  projectId: string;
  branchName: string;
  runtimeVersion: string;
  platform: 'ios' | 'android';
  message?: string;
  createdAt: string;
  manifestPermalink?: string;
}

export interface ExpoBranch {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpoChannel {
  id: string;
  name: string;
  branchName: string;
  createdAt: string;
}

export class ExpoIntegration {
  private accessToken: string;
  private projectSlug: string;
  private baseUrl = 'https://api.expo.dev/v2';

  constructor(accessToken: string, projectSlug: string) {
    this.accessToken = accessToken;
    this.projectSlug = projectSlug;
  }

  private async request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    if (response.status >= 400) {
      throw new Error(`Expo API Error: ${data.message || 'Unknown error'}`);
    }
    
    return data;
  }

  /**
   * Get project information
   */
  async getProject(): Promise<ExpoProject> {
    return this.request<ExpoProject>('GET', `/projects/${this.projectSlug}`);
  }

  /**
   * Start a new build for iOS
   */
  async buildIOS(workspace?: string): Promise<ExpoBuild> {
    return this.request<ExpoBuild>('POST', `/projects/${this.projectSlug}/builds`, {
      platform: 'ios',
      workspace,
    });
  }

  /**
   * Start a new build for Android
   */
  async buildAndroid(workspace?: string, keystore?: { alias: string; keystore: string }): Promise<ExpoBuild> {
    return this.request<ExpoBuild>('POST', `/projects/${this.projectSlug}/builds`, {
      platform: 'android',
      workspace,
      keystore,
    });
  }

  /**
   * Get build status
   */
  async getBuild(buildId: string): Promise<ExpoBuild> {
    return this.request<ExpoBuild>('GET', `/projects/${this.projectSlug}/builds/${buildId}`);
  }

  /**
   * List all builds
   */
  async listBuilds(limit = 10, platform?: 'ios' | 'android'): Promise<ExpoBuild[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (platform) params.append('platform', platform);
    
    const data = await this.request<{ builds: ExpoBuild[] }>('GET', 
      `/projects/${this.projectSlug}/builds?${params.toString()}`
    );
    return data.builds || [];
  }

  /**
   * Cancel a build
   */
  async cancelBuild(buildId: string): Promise<boolean> {
    await this.request('DELETE', `/projects/${this.projectSlug}/builds/${buildId}`);
    return true;
  }

  /**
   * Submit to App Store (iOS)
   */
  async submitiOS(archiveUrl: string, bundleId: string, appleId?: string, password?: string): Promise<ExpoSubmission> {
    return this.request<ExpoSubmission>('POST', `/projects/${this.projectSlug}/submissions`, {
      platform: 'ios',
      archiveUrl,
      bundleId,
      appleId,
      password,
    });
  }

  /**
   * Submit to Play Store (Android)
   */
  async submitAndroid(archiveUrl: string, packageName: string, serviceAccountKey?: string): Promise<ExpoSubmission> {
    return this.request<ExpoSubmission>('POST', `/projects/${this.projectSlug}/submissions`, {
      platform: 'android',
      archiveUrl,
      packageName,
      serviceAccountKey,
    });
  }

  /**
   * Get submission status
   */
  async getSubmission(submissionId: string): Promise<ExpoSubmission> {
    return this.request<ExpoSubmission>('GET', `/projects/${this.projectSlug}/submissions/${submissionId}`);
  }

  /**
   * Publish an update
   */
  async publishUpdate(branchName: string, message?: string, platform?: 'ios' | 'android'): Promise<ExpoUpdate> {
    return this.request<ExpoUpdate>('POST', `/projects/${this.projectSlug}/updates`, {
      branchName,
      message,
      platform,
    });
  }

  /**
   * List updates
   */
  async listUpdates(limit = 10, branchName?: string): Promise<ExpoUpdate[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (branchName) params.append('branchName', branchName);
    
    const data = await this.request<{ updates: ExpoUpdate[] }>('GET', `/projects/${this.projectSlug}/updates?${params.toString()}`);
    return data.updates || [];
  }

  /**
   * Get update
   */
  async getUpdate(updateId: string): Promise<ExpoUpdate> {
    return this.request<ExpoUpdate>('GET', `/projects/${this.projectSlug}/updates/${updateId}`);
  }

  /**
   * Delete update
   */
  async deleteUpdate(updateId: string): Promise<boolean> {
    await this.request('DELETE', `/projects/${this.projectSlug}/updates/${updateId}`);
    return true;
  }

  /**
   * List branches
   */
  async listBranches(): Promise<ExpoBranch[]> {
    const data = await this.request<{ branches: ExpoBranch[] }>('GET', `/projects/${this.projectSlug}/branches`);
    return data.branches || [];
  }

  /**
   * Create a new branch
   */
  async createBranch(name: string): Promise<ExpoBranch> {
    return this.request<ExpoBranch>('POST', `/projects/${this.projectSlug}/branches`, { name });
  }

  /**
   * List channels
   */
  async listChannels(): Promise<ExpoChannel[]> {
    const data = await this.request<{ channels: ExpoChannel[] }>('GET', `/projects/${this.projectSlug}/channels`);
    return data.channels || [];
  }

  /**
   * Create a channel
   */
  async createChannel(name: string, branchName: string): Promise<ExpoChannel> {
    return this.request<ExpoChannel>('POST', `/projects/${this.projectSlug}/channels`, {
      name,
      branchName,
    });
  }

  /**
   * Update a channel
   */
  async updateChannel(name: string, branchName: string): Promise<ExpoChannel> {
    return this.request<ExpoChannel>('PATCH', `/projects/${this.projectSlug}/channels/${name}`, {
      branchName,
    });
  }

  /**
   * Delete channel
   */
  async deleteChannel(name: string): Promise<boolean> {
    await this.request('DELETE', `/projects/${this.projectSlug}/channels/${name}`);
    return true;
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getProject();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Create Expo integration instance
 */
export function createExpoIntegration(): ExpoIntegration | null {
  const accessToken = process.env.EXPO_ACCESS_TOKEN;
  const projectSlug = process.env.EXPO_PROJECT_SLUG;

  if (!accessToken || !projectSlug) {
    return null;
  }

  return new ExpoIntegration(accessToken, projectSlug);
}
