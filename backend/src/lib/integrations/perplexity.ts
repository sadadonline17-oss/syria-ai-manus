/**
 * Perplexity AI Integration
 * Real API for web search and research
 */

export interface PerplexitySearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  publishedTime: string | null;
  author: string | null;
}

export interface PerplexityResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations: Array<{
    url: string;
    title: string;
  }>;
}

export class PerplexityIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    model: string = 'llama-3.1-sonar-small-128k-online',
    options?: {
      frequencyPenalty?: number;
      maxTokens?: number;
      presencePenalty?: number;
      searchRecencyFilter?: 'month' | 'week' | 'day' | 'hour';
      temperature?: number;
    }
  ): Promise<PerplexityResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        frequency_penalty: options?.frequencyPenalty ?? 0,
        max_tokens: options?.maxTokens ?? 4096,
        presence_penalty: options?.presencePenalty ?? 0,
        search_recency_filter: options?.searchRecencyFilter ?? 'month',
        temperature: options?.temperature ?? 0.2,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Perplexity API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async search(query: string, model: string = 'llama-3.1-sonar-small-128k-online'): Promise<PerplexityResponse> {
    return this.chat([
      { role: 'user', content: query }
    ], model);
  }
}

export function createPerplexityIntegration(apiKey?: string): PerplexityIntegration | null {
  const key = apiKey || process.env.PERPLEXITY_API_KEY;
  if (!key) {
    console.warn('Perplexity API key not configured');
    return null;
  }
  return new PerplexityIntegration(key);
}
