/**
 * OpenAI Integration - Extended
 * Real API for GPT-4, DALL-E, and Whisper
 */

import OpenAI from 'openai';

export interface DALLERequest {
  prompt: string;
  model?: 'dall-e-3' | 'dall-e-2';
  n?: number;
  size?: '1024x1024' | '1536x1024' | '1024x1536' | '256x256' | '512x512';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface DALLEResponse {
  created: number;
  data: Array<{
    url: string;
    revised_prompt: string;
  }>;
}

export interface WhisperRequest {
  file: any;  // Accept any type to avoid complex type conflicts
  model?: 'whisper-1';
  language?: string;
  response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  temperature?: number;
}

export interface WhisperResponse {
  text: string;
  duration: number;
  language: string;
}

export class OpenAIExtendedIntegration {
  private client: OpenAI;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OpenAI API key not configured');
    }
    this.client = new OpenAI({ apiKey: key });
  }

  // Chat Completions (already available via @ai-sdk/openai)
  async chat(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>, options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    const response = await this.client.chat.completions.create({
      model: options?.model || 'gpt-4o',
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens,
    });
    return response;
  }

  // DALL-E Image Generation
  async generateImage(request: DALLERequest): Promise<DALLEResponse> {
    const response = await this.client.images.generate({
      model: request.model || 'dall-e-3',
      prompt: request.prompt,
      n: request.n || 1,
      size: request.size || '1024x1024',
      quality: request.quality || 'standard',
      style: request.style || 'vivid',
    });

    return {
      created: response.created,
      data: response.data?.map(item => ({
        url: item.url || '',
        revised_prompt: item.revised_prompt || request.prompt,
      })) || [],
    };
  }

  // DALL-E Image Edit
  async editImage(image: Blob | Uint8Array, mask: Blob | Uint8Array | undefined, prompt: string, options?: {
    n?: number;
    size?: '1024x1024' | '1536x1024' | '1024x1536' | '256x256' | '512x512';
  }) {
    const response = await this.client.images.edit({
      image: image as any,
      mask: mask as any,
      prompt,
      n: options?.n || 1,
      size: options?.size || '1024x1024',
    });

    return {
      created: response.created,
      data: response.data?.map(item => ({
        url: item.url || '',
        revised_prompt: prompt,
      })) || [],
    };
  }

  // DALL-E Image Variations
  async createVariations(image: Blob | Uint8Array, options?: {
    n?: number;
    size?: '1024x1024' | '256x256' | '512x512';
  }) {
    const response = await this.client.images.createVariation({
      image: image as any,
      n: options?.n || 1,
      size: options?.size || '1024x1024',
    });

    return {
      created: response.created,
      data: response.data?.map(item => ({
        url: item.url || '',
        revised_prompt: 'variation',
      })) || [],
    };
  }

  // Whisper Transcription
  async transcribe(request: WhisperRequest): Promise<WhisperResponse> {
    const response = await this.client.audio.transcriptions.create({
      file: request.file as any,
      model: request.model || 'whisper-1',
      language: request.language,
      response_format: request.response_format || 'json',
      temperature: request.temperature,
    });

    return {
      text: response.text || '',
      duration: 0, // Not available in response
      language: request.language || 'en',
    };
  }

  // Whisper Translation
  async translate(audio: any, options?: {
    model?: 'whisper-1';
    response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
    temperature?: number;
  }) {
    const response = await this.client.audio.translations.create({
      file: audio as any,
      model: options?.model || 'whisper-1',
      response_format: options?.response_format || 'json',
      temperature: options?.temperature,
    });

    return {
      text: response.text || '',
      duration: 0,
      language: 'translated',
    };
  }

  // Embeddings
  async createEmbedding(input: string | string[], model: string = 'text-embedding-3-small') {
    const response = await this.client.embeddings.create({
      model,
      input: input,
    });

    return {
      model: response.model,
      data: response.data.map(item => ({
        embedding: item.embedding,
        index: item.index,
      })),
      usage: {
        prompt_tokens: response.usage?.prompt_tokens || 0,
        total_tokens: response.usage?.total_tokens || 0,
      },
    };
  }

  // Moderation
  async moderateContent(input: string | string[]) {
    const response = await this.client.moderations.create({
      input,
    });

    return {
      id: response.id,
      model: response.model,
      results: response.results.map(result => ({
        flagged: result.flagged,
        categories: result.categories,
        category_scores: result.category_scores,
      })),
    };
  }

  // List Models
  async listModels() {
    const response = await this.client.models.list();
    return {
      data: response.data.map(model => ({
        id: model.id,
        created: model.created,
        object: model.object,
        owned_by: model.owned_by,
      })),
    };
  }

  // Get Model
  async getModel(modelId: string) {
    const response = await this.client.models.retrieve(modelId);
    return {
      id: response.id,
      created: response.created,
      object: response.object,
      owned_by: response.owned_by,
    };
  }
}

export function createOpenAIExtendedIntegration(apiKey?: string): OpenAIExtendedIntegration | null {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    console.warn('OpenAI API key not configured');
    return null;
  }
  return new OpenAIExtendedIntegration(key);
}
