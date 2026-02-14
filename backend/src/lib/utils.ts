/**
 * Utility functions for Hono client creation
 */

export function createHonoClient(baseUrl: string, apiKey?: string) {
  return {
    baseUrl,
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };
      
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return response.json();
    },
  };
}

export function createAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

export function createBasicAuth(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}
