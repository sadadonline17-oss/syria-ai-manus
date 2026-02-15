import { useState, useCallback } from 'react';
import { api } from '../api';

interface CloudflareZone {
  id: string;
  name: string;
  status: string;
  plan: string;
  created_on: string;
}

interface CloudflareDNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  proxied: boolean;
  ttl: number;
}

interface CloudflareWorker {
  id: string;
  script_name: string;
  created_on: string;
  modified_on: string;
  etag: string;
}

interface CloudflareD1Database {
  uuid: string;
  name: string;
  created_time: string;
}

interface CloudflareKVNamespace {
  id: string;
  title: string;
}

export function useCloudflare() {
  const [zones, setZones] = useState<CloudflareZone[]>([]);
  const [dnsRecords, setDnsRecords] = useState<CloudflareDNSRecord[]>([]);
  const [workers, setWorkers] = useState<CloudflareWorker[]>([]);
  const [d1Databases, setD1Databases] = useState<CloudflareD1Database[]>([]);
  const [kvNamespaces, setKvNamespaces] = useState<CloudflareKVNamespace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/integrations/cloudflare/zones');
      setZones(response.data.result || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Cloudflare zones');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDNSRecords = useCallback(async (zoneId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/cloudflare/dns/${zoneId}`);
      setDnsRecords(response.data.result || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch DNS records');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDNSRecord = useCallback(async (zoneId: string, record: Partial<CloudflareDNSRecord>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/api/integrations/cloudflare/dns/${zoneId}`, record);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create DNS record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDNSRecord = useCallback(async (zoneId: string, recordId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/integrations/cloudflare/dns/${zoneId}/${recordId}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete DNS record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/integrations/cloudflare/workers');
      setWorkers(response.data.result || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Workers');
    } finally {
      setLoading(false);
    }
  }, []);

  const deployWorker = useCallback(async (scriptName: string, script: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/cloudflare/workers/deploy', {
        scriptName,
        script,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to deploy Worker');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchD1Databases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/integrations/cloudflare/d1');
      setD1Databases(response.data.result || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch D1 databases');
    } finally {
      setLoading(false);
    }
  }, []);

  const executeD1Query = useCallback(async (databaseId: string, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/api/integrations/cloudflare/d1/${databaseId}/query`, { query });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to execute query');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchKVNamespaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/integrations/cloudflare/kv');
      setKvNamespaces(response.data.result || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch KV namespaces');
    } finally {
      setLoading(false);
    }
  }, []);

  const putKVValue = useCallback(async (namespaceId: string, key: string, value: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/integrations/cloudflare/kv/${namespaceId}`, { key, value });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to put KV value');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getKVValue = useCallback(async (namespaceId: string, key: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/cloudflare/kv/${namespaceId}/${key}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get KV value');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    zones,
    dnsRecords,
    workers,
    d1Databases,
    kvNamespaces,
    loading,
    error,
    fetchZones,
    fetchDNSRecords,
    createDNSRecord,
    deleteDNSRecord,
    fetchWorkers,
    deployWorker,
    fetchD1Databases,
    executeD1Query,
    fetchKVNamespaces,
    putKVValue,
    getKVValue,
  };
}
