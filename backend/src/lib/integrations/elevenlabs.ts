/**
 * ElevenLabs AI Integration
 * Real API for voice synthesis, cloning, and audio generation
 */

export interface ElevenLabsVoice {
  voiceId: string;
  name: string;
  category: string;
  description: string;
  labels: Record<string, string>;
  setting: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

export interface ElevenLabsAudio {
  audioBase64: string;
  audioUrl?: string;
}

export interface ElevenLabsHistoryItem {
  sample_id: string;
  hash: string;
  record_date: string;
  duration: number;
  voice_name: string;
  voice_id: string;
  state: string;
}

export class ElevenLabsIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Accept': 'application/json',
      'xi-api-key': this.apiKey,
    };
  }

  // Voices
  async getVoices(): Promise<{ voices: ElevenLabsVoice[] }> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API Error: ${response.status}`);
    }
    
    return response.json();
  }

  async getVoice(voiceId: string): Promise<ElevenLabsVoice> {
    const response = await fetch(`${this.baseUrl}/voices/${voiceId}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API Error: ${response.status}`);
    }
    
    return response.json();
  }

  // Text to Speech
  async textToSpeech(
    voiceId: string,
    text: string,
    options?: {
      modelId?: string;
      stability?: number;
      similarityBoost?: number;
      style?: number;
      speakerBoost?: boolean;
      responseFormat?: 'mp3' | 'opus' | 'pcm_16khz' | 'pcm_24khz' | 'flac';
    }
  ): Promise<ArrayBuffer> {
    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: options?.modelId ?? 'eleven_multilingual_v2',
        voice_settings: {
          stability: options?.stability ?? 0.5,
          similarity_boost: options?.similarityBoost ?? 0.75,
          style: options?.style ?? 0,
          use_speaker_boost: options?.speakerBoost ?? false,
        },
        output_format: options?.responseFormat ?? 'mp3',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs TTS Error: ${response.status} - ${error}`);
    }

    return response.arrayBuffer();
  }

  // Voice Cloning
  async createVoiceClone(
    name: string,
    description: string,
    files: File[]
  ): Promise<{ voice_id: string }> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    files.forEach(file => formData.append('files', file));

    const response = await fetch(`${this.baseUrl}/voices/add`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs Clone Error: ${response.status}`);
    }

    return response.json();
  }

  // Voice Isolation
  async isolateVoice(audioUrl: string): Promise<{ audio: string }> {
    const response = await fetch(`${this.baseUrl}/voice-isolation`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audio_url: audioUrl }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs Isolation Error: ${response.status}`);
    }

    return response.json();
  }

  // User Subscription
  async getSubscription(): Promise<{
    tier: string;
    character_count: number;
    character_limit: number;
    can_extend_character_limit: boolean;
    voice_limit: number;
    can_use_instant_voice_cloning: boolean;
  }> {
    const response = await fetch(`${this.baseUrl}/user/subscription`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API Error: ${response.status}`);
    }

    return response.json();
  }

  // History
  async getHistory(limit: number = 50): Promise<{ history: ElevenLabsHistoryItem[] }> {
    const response = await fetch(`${this.baseUrl}/history?limit=${limit}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API Error: ${response.status}`);
    }

    return response.json();
  }

  async getHistoryItem(sampleId: string): Promise<{ audio_base64: string }> {
    const response = await fetch(`${this.baseUrl}/history/${sampleId}`, {
      headers: {
        ...this.getHeaders(),
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API Error: ${response.status}`);
    }

    return response.json();
  }

  // Default voices
  static getDefaultVoices() {
    return [
      { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Female voice' },
      { id: 'AZnzlk1XvdvUeBnOnPGV', name: 'Domi', description: 'Female voice' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Female voice' },
      { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Female voice' },
      { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Male voice' },
      { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Male voice' },
    ];
  }
}

export function createElevenLabsIntegration(apiKey?: string): ElevenLabsIntegration | null {
  const key = apiKey || process.env.ELEVENLABS_API_KEY;
  if (!key) {
    console.warn('ElevenLabs API key not configured');
    return null;
  }
  return new ElevenLabsIntegration(key);
}
