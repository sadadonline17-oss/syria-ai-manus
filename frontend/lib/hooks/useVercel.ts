import { BACKEND_URL } from '../api';
import { useState, useCallback } from 'react';

export interface VercelProject {
  id: string;
  name: string;
  description: string | null;
  created: number;
  updated: number;
  owner: {
    id: string;
    username: string;
  };
  link: string;
}

export interface VercelDeployment {
  id: string;
  name: string;
  status: string;
  state: string;
  created: number;
  creator: {
    uid: string;
    email: string;
  };
  meta: {
    githubCommitMessage?: string;
    githubCommitRef?: string;
    githubRepo?: string;
    githubOwner?: string;
  };
  alias?: string[];
  url: string;
}

export interface VercelDomain {
  name: string;
  configured: boolean;
  verified: boolean;
}

export function useVercel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (): Promise<VercelProject[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/vercel/projects`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      return data.projects || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (data: {
    name: string;
    framework?: string;
    dir?: string;
  }): Promise<VercelProject | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/vercel/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create project');
      const result = await response.json();
      return result.project || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeployments = useCallback(async (projectId?: string): Promise<VercelDeployment[]> => {
    setLoading(true);
    setError(null);
    try {
      const url = projectId 
        ? `${BACKEND_URL}/api/integrations/vercel/deployments?projectId=${projectId}`
        : `${BACKEND_URL}/api/integrations/vercel/deployments`;
      const response = await fetch(url, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Failed to fetch deployments');
      const data = await response.json();
      return data.deployments || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createDeployment = useCallback(async (data: {
    name: string;
    files?: Array<{ file: string; data: string }>;
    project?: string;
    target?: string;
  }): Promise<VercelDeployment | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/vercel/deployments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create deployment');
      const result = await response.json();
      return result.deployment || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDomains = useCallback(async (): Promise<VercelDomain[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/vercel/domains`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Failed to fetch domains');
      const data = await response.json();
      return data.domains || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchProjects,
    createProject,
    fetchDeployments,
    createDeployment,
    fetchDomains,
  };
}
