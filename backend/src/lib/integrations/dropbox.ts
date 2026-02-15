/**
 * Dropbox Integration
 * Real API for file storage and management
 */

export interface DropboxFile {
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
  client_modified: string;
  server_modified: string;
  size: number;
  is_downloadable: boolean;
  has_explicit_shared_members: boolean;
}

export interface DropboxFolder {
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
}

export interface DropboxSpace {
  used: number;
  allocated: number;
}

export class DropboxIntegration {
  private accessToken: string;
  private baseUrl = 'https://api.dropboxapi.com/2';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private getHeaders(contentType: string = 'application/json') {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': contentType,
    };
  }

  async listFolder(path: string = ''): Promise<{ entries: (DropboxFile | DropboxFolder)[] }> {
    const response = await fetch(`${this.baseUrl}/files/list_folder`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ path: path || '' }),
    });

    if (!response.ok) {
      throw new Error(`Dropbox API Error: ${response.status}`);
    }

    return response.json();
  }

  async uploadFile(
    path: string,
    content: string | Buffer,
    mode: 'add' | 'overwrite' | 'update' = 'add'
  ): Promise<DropboxFile> {
    const response = await fetch(`${this.baseUrl}/files/upload`, {
      method: 'POST',
      headers: this.getHeaders('application/octet-stream'),
      body: content,
    });

    if (!response.ok) {
      throw new Error(`Dropbox API Error: ${response.status}`);
    }

    return response.json();
  }

  async downloadFile(path: string): Promise<Buffer> {
    const response = await fetch(`${this.baseUrl}/files/download`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      throw new Error(`Dropbox API Error: ${response.status}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  async deleteFile(path: string): Promise<{ metadata: DropboxFile }> {
    const response = await fetch(`${this.baseUrl}/files/delete_v2`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      throw new Error(`Dropbox API Error: ${response.status}`);
    }

    return response.json();
  }

  async createFolder(path: string): Promise<DropboxFolder> {
    const response = await fetch(`${this.baseUrl}/files/create_folder_v2`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      throw new Error(`Dropbox API Error: ${response.status}`);
    }

    return response.json();
  }

  async getSpaceUsage(): Promise<DropboxSpace> {
    const response = await fetch(`${this.baseUrl}/users/get_space_usage`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Dropbox API Error: ${response.status}`);
    }

    return response.json();
  }

  async getCurrentAccount(): Promise<{ account_id: string; name: { display_name: string }; email: string }> {
    const response = await fetch(`${this.baseUrl}/users/get_current_account`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Dropbox API Error: ${response.status}`);
    }

    return response.json();
  }

  async getTemporaryLink(path: string): Promise<{ link: string }> {
    const response = await fetch(`${this.baseUrl}/files/get_temporary_link`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      throw new Error(`Dropbox API Error: ${response.status}`);
    }

    return response.json();
  }

  async copyFile(fromPath: string, toPath: string): Promise<DropboxFile> {
    const response = await fetch(`${this.baseUrl}/files/copy_v2`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ from_path: fromPath, to_path: toPath }),
    });

    if (!response.ok) {
      throw new Error(`Dropbox API Error: ${response.status}`);
    }

    return response.json();
  }

  async moveFile(fromPath: string, toPath: string): Promise<DropboxFile> {
    const response = await fetch(`${this.baseUrl}/files/move_v2`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ from_path: fromPath, to_path: toPath }),
    });

    if (!response.ok) {
      throw new Error(`Dropbox API Error: ${response.status}`);
    }

    return response.json();
  }
}

export function createDropboxIntegration(accessToken?: string): DropboxIntegration | null {
  const token = accessToken || process.env.DROPBOX_ACCESS_TOKEN;
  if (!token) {
    console.warn('Dropbox access token not configured');
    return null;
  }
  return new DropboxIntegration(token);
}
