import { BACKEND_URL } from '../api';
import { useState, useCallback } from 'react';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  user: { login: string; avatar_url: string };
  created_at: string;
  updated_at: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  html_url: string;
  user: { login: string; avatar_url: string };
  created_at: string;
  merged_at: string | null;
}

export interface GitHubWorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  head_branch: string;
  run_number: number;
  created_at: string;
}

export function useGitHub() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(async (username?: string): Promise<GitHubRepo[]> => {
    setLoading(true);
    setError(null);
    try {
      const url = username 
        ? `${BACKEND_URL}/api/integrations/github/repos?username=${encodeURIComponent(username)}`
        : `${BACKEND_URL}/api/integrations/github/repos`;
      const response = await fetch(url, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Failed to fetch repositories');
      const data = await response.json();
      return data.repos || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRepo = useCallback(async (owner: string, repo: string): Promise<GitHubRepo | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/integrations/github/repos/${owner}/${repo}`,
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );
      if (!response.ok) throw new Error('Failed to fetch repository');
      const data = await response.json();
      return data.repo || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRepo = useCallback(async (
    name: string,
    description?: string,
    isPrivate?: boolean
  ): Promise<GitHubRepo | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/github/repos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ name, description, isPrivate }),
      });
      if (!response.ok) throw new Error('Failed to create repository');
      const data = await response.json();
      return data.repo || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIssues = useCallback(async (
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'open'
  ): Promise<GitHubIssue[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/integrations/github/repos/${owner}/${repo}/issues?state=${state}`,
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );
      if (!response.ok) throw new Error('Failed to fetch issues');
      const data = await response.json();
      return data.issues || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createIssue = useCallback(async (
    owner: string,
    repo: string,
    title: string,
    body?: string,
    labels?: string[]
  ): Promise<GitHubIssue | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/integrations/github/repos/${owner}/${repo}/issues`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({ title, body, labels }),
        }
      );
      if (!response.ok) throw new Error('Failed to create issue');
      const data = await response.json();
      return data.issue || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPullRequests = useCallback(async (
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'open'
  ): Promise<GitHubPullRequest[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/integrations/github/repos/${owner}/${repo}/pulls?state=${state}`,
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );
      if (!response.ok) throw new Error('Failed to fetch pull requests');
      const data = await response.json();
      return data.pulls || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWorkflowRuns = useCallback(async (
    owner: string,
    repo: string
  ): Promise<GitHubWorkflowRun[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/integrations/github/repos/${owner}/${repo}/actions`,
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );
      if (!response.ok) throw new Error('Failed to fetch workflow runs');
      const data = await response.json();
      return data.workflow_runs || [];
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
    fetchRepos,
    fetchRepo,
    createRepo,
    fetchIssues,
    createIssue,
    fetchPullRequests,
    fetchWorkflowRuns,
  };
}
