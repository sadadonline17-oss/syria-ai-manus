/**
 * Kling AI Video Generation Integration
 * Real API for AI-powered video creation
 */

export interface KlingVideoRequest {
  prompt: string;
  negativePrompt?: string;
  mode: 'std' | 'pro';
  aspectRatio?: '16:9' | '9:16' | '1:1' | '3:4' | '4:3' | '4:5' | '6:5' | '9:14';
  duration?: 5 | 10;
  callbackUrl?: string;
  imageUrl?: string;
}

export interface KlingVideoResponse {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAIL';
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  metadata?: {
    prompt: string;
    duration: number;
    mode: string;
  };
}

export class KlingIntegration {
  private accessKey: string;
  private secretKey: string;
  private baseUrl = 'https://api.klingai.com/v1';

  constructor(accessKey: string, secretKey: string) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
  }

  private generateSignature(timestamp: number, method: string, url: string): string {
    // Simplified - in production use proper HMAC-SHA256
    const message = timestamp + method + url;
    return Buffer.from(this.secretKey + message).toString('base64');
  }

  async textToVideo(request: KlingVideoRequest): Promise<KlingVideoResponse> {
    const timestamp = Date.now();
    
    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Timestamp': timestamp.toString(),
        'X-Authorization': this.accessKey,
      },
      body: JSON.stringify({
        prompt: request.prompt,
        negative_prompt: request.negativePrompt,
        mode: request.mode || 'std',
        aspect_ratio: request.aspectRatio || '16:9',
        duration: request.duration || 5,
        callback_url: request.callbackUrl,
        image_url: request.imageUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Kling API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async imageToVideo(
    imageUrl: string,
    prompt: string,
    options?: {
      mode?: 'std' | 'pro';
      duration?: 5 | 10;
    }
  ): Promise<KlingVideoResponse> {
    return this.textToVideo({
      prompt,
      imageUrl,
      mode: options?.mode || 'std',
      duration: options?.duration || 5,
    });
  }

  async getGenerationStatus(id: string): Promise<KlingVideoResponse> {
    const response = await fetch(`${this.baseUrl}/images/generations/${id}`, {
      headers: {
        'X-Authorization': this.accessKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Kling API Error: ${response.status}`);
    }

    return response.json();
  }

  async listGenerations(limit: number = 20): Promise<{ generations: KlingVideoResponse[] }> {
    const response = await fetch(`${this.baseUrl}/images/generations?limit=${limit}`, {
      headers: {
        'X-Authorization': this.accessKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Kling API Error: ${response.status}`);
    }

    return response.json();
  }
}

export function createKlingIntegration(accessKey?: string, secretKey?: string): KlingIntegration | null {
  const key = accessKey || process.env.KLING_ACCESS_KEY;
  const secret = secretKey || process.env.KLING_SECRET_KEY;
  if (!key || !secret) {
    console.warn('Kling API credentials not configured');
    return null;
  }
  return new KlingIntegration(key, secret);
}
