/**
 * HeyGen AI Video Integration
 * Real API for AI-powered video generation with virtual avatars
 */

export interface HeygenVideoRequest {
  videoInputs: Array<{
    avatarId?: string;
    avatarName?: string;
    voiceId?: string;
    text: string;
    background?: string;
    offset?: { x: number; y: number };
    scale?: number;
  }>;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  test?: boolean;
  callbackUrl?: string;
}

export interface HeygenVideoResponse {
  videoId: string;
  status: 'transcribing' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface HeygenAvatar {
  avatarId: string;
  avatarName: string;
  gender: string;
  thumbnailUrl: string;
  previewVideoUrl: string;
}

export interface HeygenVoice {
  voiceId: string;
  voiceName: string;
  language: string;
  gender: string;
}

export class HeygenIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.heygen.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async generateVideo(request: HeygenVideoRequest): Promise<HeygenVideoResponse> {
    const response = await fetch(`${this.baseUrl}/avatars/video_generation`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HeyGen API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getVideoStatus(videoId: string): Promise<HeygenVideoResponse> {
    const response = await fetch(`${this.baseUrl}/avatars/video_generation/${videoId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API Error: ${response.status}`);
    }

    return response.json();
  }

  async listAvatars(): Promise<{ avatars: HeygenAvatar[] }> {
    const response = await fetch(`${this.baseUrl}/avatars`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API Error: ${response.status}`);
    }

    return response.json();
  }

  async listVoices(): Promise<{ voices: HeygenVoice[] }> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API Error: ${response.status}`);
    }

    return response.json();
  }

  async getUserInfo(): Promise<{ user_id: string; email: string; plan: string }> {
    const response = await fetch(`${this.baseUrl}/user/info`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API Error: ${response.status}`);
    }

    return response.json();
  }

  async getUsage(): Promise<{
    video_seconds_used: number;
    video_seconds_limit: number;
    minutes_used: number;
    minutes_limit: number;
  }> {
    const response = await fetch(`${this.baseUrl}/user/usage`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API Error: ${response.status}`);
    }

    return response.json();
  }
}

export function createHeygenIntegration(apiKey?: string): HeygenIntegration | null {
  const key = apiKey || process.env.HEYGEN_API_KEY;
  if (!key) {
    console.warn('HeyGen API key not configured');
    return null;
  }
  return new HeygenIntegration(key);
}
