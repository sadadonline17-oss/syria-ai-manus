/**
 * Flux AI Image Generation Integration
 * Real API for AI-powered image generation
 */

export interface FluxImageRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  guidanceScale?: number;
  numInferenceSteps?: number;
  seed?: number;
}

export interface FluxImageResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  output?: string[];
  error?: string;
  timing?: {
    inference: number;
    total: number;
  };
}

export class FluxIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.flux.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(request: FluxImageRequest): Promise<FluxImageResponse> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        negative_prompt: request.negativePrompt,
        width: request.width || 1024,
        height: request.height || 1024,
        num_outputs: request.numOutputs || 1,
        guidance_scale: request.guidanceScale || 7.5,
        num_inference_steps: request.numInferenceSteps || 30,
        seed: request.seed,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Flux API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getGenerationStatus(id: string): Promise<FluxImageResponse> {
    const response = await fetch(`${this.baseUrl}/generations/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Flux API Error: ${response.status}`);
    }

    return response.json();
  }

  async listGenerations(limit: number = 20): Promise<{ generations: FluxImageResponse[] }> {
    const response = await fetch(`${this.baseUrl}/generations?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Flux API Error: ${response.status}`);
    }

    return response.json();
  }
}

export function createFluxIntegration(apiKey?: string): FluxIntegration | null {
  const key = apiKey || process.env.FLUX_API_KEY;
  if (!key) {
    console.warn('Flux API key not configured');
    return null;
  }
  return new FluxIntegration(key);
}
