/**
 * Real GitHub API Integration
 * Provides actual functionality for repos, issues, pulls, and actions
 */

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  labels: Array<{ name: string; color: string }>;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  created_at: string;
  merged: boolean;
}

export interface GitHubAction {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  head_branch: string;
  event: string;
}

export class GitHubIntegration {
  private token: string;
  private baseUrl = 'https://api.github.com';

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Repository Operations
  async listRepos(username?: string): Promise<GitHubRepo[]> {
    const endpoint = username ? `/users/${username}/repos` : '/user/repos';
    return this.request<GitHubRepo[]>(`${endpoint}?per_page=100&sort=updated`);
  }

  async getRepo(owner: string, repo: string): Promise<GitHubRepo> {
    return this.request<GitHubRepo>(`/repos/${owner}/${repo}`);
  }

  async createRepo(name: string, description?: string, isPrivate: boolean = false): Promise<GitHubRepo> {
    return this.request<GitHubRepo>('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
        auto_init: true,
      }),
    });
  }

  // Issues Operations
  async listIssues(owner: string, repo: string, state: string = 'open'): Promise<GitHubIssue[]> {
    return this.request<GitHubIssue[]>(`/repos/${owner}/${repo}/issues?state=${state}&per_page=100`);
  }

  async getIssue(owner: string, repo: string, issueNumber: number): Promise<GitHubIssue> {
    return this.request<GitHubIssue>(`/repos/${owner}/${repo}/issues/${issueNumber}`);
  }

  async createIssue(
    owner: string,
    repo: string,
    title: string,
    body?: string,
    labels?: string[]
  ): Promise<GitHubIssue> {
    return this.request<GitHubIssue>(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify({ title, body, labels }),
    });
  }

  async updateIssue(
    owner: string,
    repo: string,
    issueNumber: number,
    updates: { title?: string; body?: string; state?: string; labels?: string[] }
  ): Promise<GitHubIssue> {
    return this.request<GitHubIssue>(`/repos/${owner}/${repo}/issues/${issueNumber}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async closeIssue(owner: string, repo: string, issueNumber: number): Promise<GitHubIssue> {
    return this.updateIssue(owner, repo, issueNumber, { state: 'closed' });
  }

  // Pull Request Operations
  async listPullRequests(owner: string, repo: string, state: string = 'open'): Promise<GitHubPullRequest[]> {
    return this.request<GitHubPullRequest[]>(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=100`);
  }

  async getPullRequest(owner: string, repo: string, prNumber: number): Promise<GitHubPullRequest> {
    return this.request<GitHubPullRequest>(`/repos/${owner}/${repo}/pulls/${prNumber}`);
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string,
    body?: string
  ): Promise<GitHubPullRequest> {
    return this.request<GitHubPullRequest>(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({ title, head, base, body }),
    });
  }

  // GitHub Actions
  async listWorkflows(owner: string, repo: string): Promise<{ workflows: Array<{ id: number; name: string; state: string; html_url: string }> }> {
    return this.request(`/repos/${owner}/${repo}/actions/workflows`);
  }

  async listWorkflowRuns(owner: string, repo: string): Promise<{ workflow_runs: GitHubAction[] }> {
    return this.request(`/repos/${owner}/${repo}/actions/runs?per_page=20`);
  }

  async triggerWorkflow(owner: string, repo: string, workflowId: string, ref: string = 'main'): Promise<void> {
    await this.request(`/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
      method: 'POST',
      body: JSON.stringify({ ref }),
    });
  }

  // Search
  async searchRepos(query: string): Promise<{ items: GitHubRepo[] }> {
    return this.request(`/search/repositories?q=${encodeURIComponent(query)}&per_page=20`);
  }

  async searchIssues(query: string): Promise<{ items: GitHubIssue[] }> {
    return this.request(`/search/issues?q=${encodeURIComponent(query)}&per_page=20`);
  }

  // File Operations
  async getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<{ content: string; sha: string }> {
    const endpoint = ref
      ? `/repos/${owner}/${repo}/contents/${path}?ref=${ref}`
      : `/repos/${owner}/${repo}/contents/${path}`;
    const result = await this.request<{ content: string; sha: string; encoding: string }>(endpoint);
    
    if (result.encoding === 'base64') {
      return {
        content: Buffer.from(result.content, 'base64').toString('utf-8'),
        sha: result.sha,
      };
    }
    return result;
  }

  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    message: string,
    content: string,
    sha?: string
  ): Promise<{ content: { html_url: string } }> {
    const body: Record<string, string> = {
      message,
      content: Buffer.from(content).toString('base64'),
    };
    if (sha) body.sha = sha;

    return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
}

// Factory function for creating GitHub integration instance
export function createGitHubIntegration(token?: string): GitHubIntegration | null {
  const githubToken = token || process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.warn('GitHub token not configured. Set GITHUB_TOKEN environment variable.');
    return null;
  }
  return new GitHubIntegration(githubToken);
}