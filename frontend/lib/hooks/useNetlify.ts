import { useState, useCallback } from 'react';
import { api } from '../api';

interface NetlifySite {
  id: string;
  name: string;
  url: string;
  state: string;
  created_at: string;
  updated_at: string;
}

interface NetlifyDeploy {
  id: string;
  state: string;
  branch: string;
  commit_ref: string;
  deploy_time: number;
  ready?: number;
}

interface NetlifyFunction {
  name: string;
  displayName: string;
  module: string;
  path: string;
}

export function useNetlify() {
  const [sites, setSites] = useState<NetlifySite[]>([]);
  const [deploys, setDeploys] = useState<NetlifyDeploy[]>([]);
  const [functions, setFunctions] = useState<NetlifyFunction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/integrations/netlify/sites');
      setSites(response.data.sites || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Netlify sites');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeploys = useCallback(async (siteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/netlify/deploys/${siteId}`);
      setDeploys(response.data.deploys || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deploys');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFunctions = useCallback(async (siteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/netlify/functions/${siteId}`);
      setFunctions(response.data.functions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch functions');
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerDeploy = useCallback(async (siteId: string, branch: string = 'main') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/api/integrations/netlify/deploy/${siteId}`, { branch });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to trigger deploy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rollbackDeploy = useCallback(async (siteId: string, deployId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/api/integrations/netlify/rollback/${siteId}`, { deployId });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to rollback deploy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sites,
    deploys,
    functions,
    loading,
    error,
    fetchSites,
    fetchDeploys,
    fetchFunctions,
    triggerDeploy,
    rollbackDeploy,
  };
}
