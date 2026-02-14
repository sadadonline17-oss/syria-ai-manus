/**
 * Ahrefs SEO Integration
 * Real API for SEO analytics and keyword research
 */

export interface AhrefsDomainOverview {
  domain_rating: number;
  url_rating: number;
  backlinks: number;
  referring_domains: number;
  organic_keywords: number;
  organic_traffic: number;
  paid_keywords: number;
}

export interface AhrefsKeywordInfo {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
  results: number;
  text_volume: number;
  trend: Array<{ year: number; month: number; volume: number }>;
}

export interface AhrefsBacklink {
  fromsite: string;
  fromurl: string;
  tosite: string;
  tourl: string;
  first_seen: string;
  last_visited: string;
  links: number;
  language: string;
  domain_rating: number;
  url_rating: number;
  citation_flow: number;
  trust_flow: number;
  is_follow: boolean;
  is_redirect: boolean;
  anchor: string;
}

export class AhrefsIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.ahrefs.com/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getDomainOverview(domain: string): Promise<AhrefsDomainOverview> {
    const response = await fetch(`${this.baseUrl}/domain-overview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: domain,
        mode: 'domain',
      }),
    });

    if (!response.ok) {
      throw new Error(`Ahrefs API Error: ${response.status}`);
    }

    return response.json();
  }

  async getKeywordsForDomain(
    domain: string,
    limit: number = 100
  ): Promise<{ keywords: AhrefsKeywordInfo[] }> {
    const response = await fetch(`${this.baseUrl}/keywords_for_domain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: domain,
        mode: 'domain',
        limit,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ahrefs API Error: ${response.status}`);
    }

    return response.json();
  }

  async getBacklinks(
    target: string,
    limit: number = 100
  ): Promise<{ backLinks: AhrefsBacklink[] }> {
    const response = await fetch(`${this.baseUrl}/backlinks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target,
        limit,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ahrefs API Error: ${response.status}`);
    }

    return response.json();
  }

  async getKeywordDifficulty(keyword: string): Promise<AhrefsKeywordInfo> {
    const response = await fetch(`${this.baseUrl}/keyword_difficulty`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ahrefs API Error: ${response.status}`);
    }

    return response.json();
  }

  async getContentGap(
    domains: string[],
    target: string
  ): Promise<{ keywords: AhrefsKeywordInfo[] }> {
    const response = await fetch(`${this.baseUrl}/content_gap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targets: [target],
        competitors: domains,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ahrefs API Error: ${response.status}`);
    }

    return response.json();
  }
}

export function createAhrefsIntegration(apiKey?: string): AhrefsIntegration | null {
  const key = apiKey || process.env.AHREFS_API_KEY;
  if (!key) {
    console.warn('Ahrefs API key not configured');
    return null;
  }
  return new AhrefsIntegration(key);
}
