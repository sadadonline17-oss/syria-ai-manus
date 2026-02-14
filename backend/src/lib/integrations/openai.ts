/**
 * OpenAI Integration - Extended
 * Real API for GPT-4, DALL-E, and Whisper
 */

import OpenAI from 'openai';

export interface DALLERequest {
  prompt: string;
  model?: 'dall-e-3' | 'dall-e-2';
  n?: number;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
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
  file: Buffer | Blob;
  model?: 'whisper-1' | 'whisper-2';
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
      data: response.data.map(item => ({
        url: item.url || '',
        revised_prompt: item.revised_prompt || request.prompt,
      })),
    };
  }

  // DALL-E Image Edit
  async editImage(image: Buffer, mask: Buffer | undefined, prompt: string, options?: {
    n?: number;
    size?: '1024x1024' | '1792x1024' | '1024x1792';
  }) {
    const response = await this.client.images.edit({
      image,
      mask,
      prompt,
      n: options?.n || 1,
      size: options?.size || '1024x1024',
    });

    return {
      created: response.created,
      data: response.data.map(item => ({
        url: item.url || '',
        revised_prompt: prompt,
      })),
    };
  }

  // DALL-E Image Variations
  async createVariations(image: Buffer, options?: {
    n?: number;
    size?: '1024x1024' | '1792x1024' | '1024x1792';
  }) {
    const response = await this.client.images.createVariation({
      image,
      n: options?.n || 1,
      size: options?.size || '1024x1024',
    });

    return {
      created: response.created,
      data: response.data.map(item => ({
        url: item.url || '',
        revised_prompt: 'variation',
      })),
    };
  }

  // Whisper Transcription
  async transcribe(request: WhisperRequest): Promise<WhisperResponse> {
    const formData = new FormData();
    formData.append('file', new Blob([request.file]));
    formData.append('model', request.model || 'whisper-1');
    if (request.language) formData.append('language', request.language);
    if (request.response_format) formData.append('response_format', request.response_format);
    if (request.temperature !== undefined) formData.append('temperature', request.temperature.toString());

    const response = await this.client.audio.transcriptions.create({
      file: new Blob([request.file]),
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
  async translate(audio: Buffer, options?: {
    model?: 'whisper-1';
    response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
    temperature?: number;
  }) {
    const response = await this.client.audio.translations.create({
      file: new Blob([audio]),
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
