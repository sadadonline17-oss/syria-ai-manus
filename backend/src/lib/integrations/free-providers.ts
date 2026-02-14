/**
 * Free Integrations for Syria AI
 * Railway, Render, Fly.io, Supabase, MongoDB Atlas, PlanetScale, Neon, etc.
 */

// ============= RAILWAY =============

export interface RailwayProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RailwayService {
  id: string;
  name: string;
  projectId: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETING';
}

export interface RailwayDeployment {
  id: string;
  status: 'PENDING' | 'BUILDING' | 'READY' | 'ERROR';
  createdAt: string;
}

class RailwayIntegration {
  private token: string;
  private baseUrl = 'https://backboard.railway.app/api/v1';

  constructor(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response.json();
  }

  async listProjects(): Promise<RailwayProject[]> {
    const data = await this.request('/projects');
    return data.projects || [];
  }

  async listServices(projectId: string): Promise<RailwayService[]> {
    const data = await this.request(`/projects/${projectId}/services`);
    return data.services || [];
  }

  async listDeployments(projectId: string, serviceId: string): Promise<RailwayDeployment[]> {
    const data = await this.request(`/projects/${projectId}/services/${serviceId}/deployments`);
    return data.deployments || [];
  }
}

// ============= RENDER =============

export interface RenderService {
  id: string;
  name: string;
  type: 'web' | 'cron' | 'private' | 'bg';
  status: 'live' | 'sleeping' | 'building' | 'errored';
  createdAt: string;
}

class RenderIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.render.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
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
    return response.json();
  }

  async listServices(): Promise<RenderService[]> {
    const data = await this.request('/services');
    return data || [];
  }

  async getService(serviceId: string): Promise<RenderService> {
    return this.request(`/services/${serviceId}`);
  }

  async deployService(serviceId: string): Promise<void> {
    await this.request(`/services/${serviceId}/deploys`, { method: 'POST' });
  }
}

// ============= FLY.IO =============

export interface FlyApp {
  id: string;
  name: string;
  hostname: string;
  status: 'running' | 'suspended';
  created_at: string;
}

class FlyIntegration {
  private token: string;
  private baseUrl = 'https://api.machines.dev/v1';

  constructor(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response.json();
  }

  async listApps(): Promise<FlyApp[]> {
    const data = await this.request('/apps');
    return data.apps || [];
  }

  async getApp(appId: string): Promise<FlyApp> {
    return this.request(`/apps/${appId}`);
  }

  async listMachines(appId: string): Promise<any[]> {
    const data = await this.request(`/apps/${appId}/machines`);
    return data || [];
  }
}

// ============= PLANETSCALE =============

export interface PlanetScaleDatabase {
  id: string;
  name: string;
  hostname: string;
  region: string;
  created_at: string;
}

class PlanetScaleIntegration {
  private token: string;
  private org: string;
  private baseUrl = 'https://api.planetscale.com/v1';

  constructor(token: string, org: string) {
    this.token = token;
    this.org = org;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response.json();
  }

  async listDatabases(): Promise<PlanetScaleDatabase[]> {
    const data = await this.request(`/organizations/${this.org}/databases`);
    return data.data || [];
  }

  async createDatabase(name: string, region: string = 'us-east'): Promise<PlanetScaleDatabase> {
    return this.request(`/organizations/${this.org}/databases`, {
      method: 'POST',
      body: JSON.stringify({ name, region }),
    });
  }
}

// ============= NEON =============

export interface NeonProject {
  id: string;
  name: string;
  platform: { id: string; display_name: string };
  region: { id: string; display_name: string };
}

export interface NeonBranch {
  id: string;
  name: string;
  default: boolean;
}

class NeonIntegration {
  private apiKey: string;
  private baseUrl = 'https://console.neon.tech/api/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
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
    return response.json();
  }

  async listProjects(): Promise<NeonProject[]> {
    const data = await this.request('/projects');
    return data.projects || [];
  }

  async listBranches(projectId: string): Promise<NeonBranch[]> {
    const data = await this.request(`/projects/${projectId}/branches`);
    return data.branches || [];
  }
}

// ============= MONGODB ATLAS =============

export interface MongoDBCluster {
  id: string;
  name: string;
  mongoDbVersion: string;
  stateName: string;
  replicationSpecs: any[];
}

class MongoDBIntegration {
  private publicKey: string;
  private privateKey: string;
  private groupId: string;
  private baseUrl = 'https://cloud.mongodb.com/api/atlas/v1.0';

  constructor(publicKey: string, privateKey: string, groupId: string) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.groupId = groupId;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const auth = Buffer.from(`${this.publicKey}:${this.privateKey}`).toString('base64');
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response.json();
  }

  async listClusters(): Promise<MongoDBCluster[]> {
    const data = await this.request(`/groups/${this.groupId}/clusters`);
    return data.results || [];
  }

  async getCluster(clusterName: string): Promise<MongoDBCluster> {
    return this.request(`/groups/${this.groupId}/clusters/${clusterName}`);
  }
}

// Factory functions

let railwayClient: RailwayIntegration | null = null;
let renderClient: RenderIntegration | null = null;
let flyClient: FlyIntegration | null = null;
let planetScaleClient: PlanetScaleIntegration | null = null;
let neonClient: NeonIntegration | null = null;
let mongoClient: MongoDBIntegration | null = null;

export function createRailwayIntegration(): RailwayIntegration | null {
  const token = process.env.RAILWAY_TOKEN;
  if (!token) return null;
  if (!railwayClient) railwayClient = new RailwayIntegration(token);
  return railwayClient;
}

export function createRenderIntegration(): RenderIntegration | null {
  const apiKey = process.env.RENDER_API_KEY;
  if (!apiKey) return null;
  if (!renderClient) renderClient = new RenderIntegration(apiKey);
  return renderClient;
}

export function createFlyIntegration(): FlyIntegration | null {
  const token = process.env.FLY_TOKEN;
  if (!token) return null;
  if (!flyClient) flyClient = new FlyIntegration(token);
  return flyClient;
}

export function createPlanetScaleIntegration(): PlanetScaleIntegration | null {
  const token = process.env.PLANETSCALE_TOKEN;
  const org = process.env.PLANETSCALE_ORG;
  if (!token || !org) return null;
  if (!planetScaleClient) planetScaleClient = new PlanetScaleIntegration(token, org);
  return planetScaleClient;
}

export function createNeonIntegration(): NeonIntegration | null {
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) return null;
  if (!neonClient) neonClient = new NeonIntegration(apiKey);
  return neonClient;
}

export function createMongoDBIntegration(): MongoDBIntegration | null {
  const publicKey = process.env.MONGODB_PUBLIC_KEY;
  const privateKey = process.env.MONGODB_PRIVATE_KEY;
  const groupId = process.env.MONGODB_GROUP_ID;
  if (!publicKey || !privateKey || !groupId) return null;
  if (!mongoClient) mongoClient = new MongoDBIntegration(publicKey, privateKey, groupId);
  return mongoClient;
}
