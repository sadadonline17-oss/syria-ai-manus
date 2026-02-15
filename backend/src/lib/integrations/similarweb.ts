/**
 * Similarweb Analytics Integration
 * Real API for website traffic analysis and competitive intelligence
 */

export interface SimilarwebTrafficOverview {
  webstats: {
    visits: number;
    pagesPerVisit: number;
    avgVisitDuration: number;
    bounceRate: number;
  };
  ranking: {
    rank: number;
    countryRank: number;
    categoryRank: number;
  };
  traffic: {
    total: number;
    desktop: number;
    mobile: number;
  };
}

export interface SimilarwebTrafficSource {
  source: string;
  share: number;
}

export interface SimilarwebCategory {
  id: number;
  name: string;
}

export interface SimilarwebKeyword {
  keyword: string;
  visits: number;
  change: number;
  category: string;
}

export class SimilarwebIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.similarweb.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Authorization': `ApiKey ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async getWebsiteOverview(
    domain: string,
    country: string = 'world'
  ): Promise<SimilarwebTrafficOverview> {
    const response = await fetch(
      `${this.baseUrl}/website/${domain}/overall-rank?country=${country}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Similarweb API Error: ${response.status}`);
    }

    return response.json();
  }

  async getTrafficSources(
    domain: string,
    timeRange: string = '3m'
  ): Promise<{ direct: SimilarwebTrafficSource[]; refer: SimilarwebTrafficSource[]; social: SimilarwebTrafficSource[] }> {
    const response = await fetch(
      `${this.baseUrl}/website/${domain}/traffic-sources?time_range=${timeRange}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Similarweb API Error: ${response.status}`);
    }

    return response.json();
  }

  async getTopCategories(): Promise<{ categories: SimilarwebCategory[] }> {
    const response = await fetch(`${this.baseUrl}/category/list`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Similarweb API Error: ${response.status}`);
    }

    return response.json();
  }

  async getRankings(
    domain: string,
    timeRange: string = '3m'
  ): Promise<{
    rank: number;
    category: { id: number; name: string };
    country: { id: number; name: string };
  }> {
    const response = await fetch(
      `${this.baseUrl}/website/${domain}/rankings?time_range=${timeRange}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Similarweb API Error: ${response.status}`);
    }

    return response.json();
  }

  async getOrganicKeywords(
    domain: string,
    limit: number = 50
  ): Promise<{ keywords: SimilarwebKeyword[] }> {
    const response = await fetch(
      `${this.baseUrl}/website/${domain}/organic-keywords?limit=${limit}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Similarweb API Error: ${response.status}`);
    }

    return response.json();
  }

  async getPaidKeywords(
    domain: string,
    limit: number = 50
  ): Promise<{ keywords: SimilarwebKeyword[] }> {
    const response = await fetch(
      `${this.baseUrl}/website/${domain}/paid-keywords?limit=${limit}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Similarweb API Error: ${response.status}`);
    }

    return response.json();
  }

  async getCompetitors(
    domain: string,
    timeRange: string = '3m'
  ): Promise<{ competitors: Array<{ domain: string; score: number }> }> {
    const response = await fetch(
      `${this.baseUrl}/website/${domain}/similar-sites?time_range=${timeRange}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Similarweb API Error: ${response.status}`);
    }

    return response.json();
  }
}

export function createSimilarwebIntegration(apiKey?: string): SimilarwebIntegration | null {
  const key = apiKey || process.env.SIMILARWEB_API_KEY;
  if (!key) {
    console.warn('Similarweb API key not configured');
    return null;
  }
  return new SimilarwebIntegration(key);
}
