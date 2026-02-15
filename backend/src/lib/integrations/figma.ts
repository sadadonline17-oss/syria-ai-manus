/**
 * Figma Integration
 * Real API for design files and prototypes
 */

export interface FigmaFile {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

export interface FigmaComponent {
  key: string;
  name: string;
  description: string;
}

export class FigmaIntegration {
  private accessToken: string;
  private baseUrl = 'https://api.figma.com/v1';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private getHeaders() {
    return {
      'X-Figma-Token': this.accessToken,
    };
  }

  async getFile(fileKey: string): Promise<{ name: string; document: FigmaNode; components: Record<string, FigmaComponent> }> {
    const response = await fetch(`${this.baseUrl}/files/${fileKey}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Figma API Error: ${response.status}`);
    }

    return response.json();
  }

  async getFileNodes(
    fileKey: string,
    nodeIds: string[]
  ): Promise<{ nodes: Record<string, { document: FigmaNode }> }> {
    const ids = nodeIds.join(',');
    const response = await fetch(`${this.baseUrl}/files/${fileKey}/nodes?ids=${ids}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Figma API Error: ${response.status}`);
    }

    return response.json();
  }

  async getImages(
    fileKey: string,
    nodeIds: string[],
    format: 'jpg' | 'png' | 'svg' | 'pdf' = 'png',
    scale: number = 2
  ): Promise<{ images: Record<string, string> }> {
    const ids = nodeIds.join(',');
    const response = await fetch(
      `${this.baseUrl}/images/${fileKey}?ids=${ids}&format=${format}&scale=${scale}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Figma API Error: ${response.status}`);
    }

    return response.json();
  }

  async getComments(fileKey: string): Promise<{ comments: Array<{ id: string; message: string; user: { handle: string } }> }> {
    const response = await fetch(`${this.baseUrl}/files/${fileKey}/comments`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Figma API Error: ${response.status}`);
    }

    return response.json();
  }

  async postComment(
    fileKey: string,
    message: string,
    clientMeta?: { x: number; y: number }
  ): Promise<{ id: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/files/${fileKey}/comments`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, client_meta: clientMeta }),
    });

    if (!response.ok) {
      throw new Error(`Figma API Error: ${response.status}`);
    }

    return response.json();
  }

  async getStyles(fileKey: string): Promise<{ styles: Record<string, { name: string; styleType: string }> }> {
    const response = await fetch(`${this.baseUrl}/files/${fileKey}/styles`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Figma API Error: ${response.status}`);
    }

    return response.json();
  }

  async getFileComponents(fileKey: string): Promise<{ components: Record<string, FigmaComponent> }> {
    const response = await fetch(`${this.baseUrl}/files/${fileKey}/components`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Figma API Error: ${response.status}`);
    }

    return response.json();
  }
}

export function createFigmaIntegration(accessToken?: string): FigmaIntegration | null {
  const token = accessToken || process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.warn('Figma access token not configured');
    return null;
  }
  return new FigmaIntegration(token);
}
