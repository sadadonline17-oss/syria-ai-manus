import { useState, useCallback } from 'react';
import { api } from '../api';

interface DropboxFile {
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
  .tag: string;
  size?: number;
  server_modified?: string;
  rev?: string;
  is_downloadable?: boolean;
  has_explicit_shared_members?: boolean;
  content_hash?: string;
}

interface DropboxFolder {
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
  .tag: string;
  shared_folder_id?: string;
  parent_shared_folder_id?: string;
}

interface DropboxSpace {
  allocated: number;
  used: number;
}

interface DropboxMember {
  .tag: string;
  account_id: string;
  email: string;
  display_name: string;
  status?: {
    .tag: string;
  };
  joined_on?: string;
}

export function useDropbox() {
  const [files, setFiles] = useState<(DropboxFile | DropboxFolder)[]>([]);
  const [space, setSpace] = useState<DropboxSpace | null>(null);
  const [members, setMembers] = useState<DropboxMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listFiles = useCallback(async (path: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/dropbox/files?path=${encodeURIComponent(path)}`);
      setFiles(response.data.entries || []);
    } catch (err: any) {
      setError(err.message || 'Failed to list files');
    } finally {
      setLoading(false);
    }
  }, []);

  const getFileContent = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/dropbox/content?path=${encodeURIComponent(path)}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get file content');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = useCallback(async (path: string, content: string, mode: string = 'add') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/dropbox/upload', {
        path,
        content,
        mode,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFolder = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/dropbox/folder', { path });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create folder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/integrations/dropbox/files?path=${encodeURIComponent(path)}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete file');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const moveFile = useCallback(async (fromPath: string, toPath: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/dropbox/move', {
        from_path: fromPath,
        to_path: toPath,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to move file');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const copyFile = useCallback(async (fromPath: string, toPath: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/dropbox/copy', {
        from_path: fromPath,
        to_path: toPath,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to copy file');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getShareLink = useCallback(async (path: string, expires?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/dropbox/share', {
        path,
        expires,
      });
      return response.data.url;
    } catch (err: any) {
      setError(err.message || 'Failed to get share link');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSpaceUsage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/integrations/dropbox/space');
      setSpace(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to get space usage');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFiles = useCallback(async (query: string, path: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/dropbox/search?q=${encodeURIComponent(query)}&path=${encodeURIComponent(path)}`);
      setFiles(response.data.matches || []);
    } catch (err: any) {
      setError(err.message || 'Failed to search files');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTemporaryLink = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/dropbox/link?path=${encodeURIComponent(path)}`);
      return response.data.link;
    } catch (err: any) {
      setError(err.message || 'Failed to get temporary link');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getThumbnail = useCallback(async (path: string, size: string = 'w640h480') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/dropbox/thumbnail?path=${encodeURIComponent(path)}&size=${size}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get thumbnail');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    files,
    space,
    members,
    loading,
    error,
    listFiles,
    getFileContent,
    uploadFile,
    createFolder,
    deleteFile,
    moveFile,
    copyFile,
    getShareLink,
    getSpaceUsage,
    searchFiles,
    getTemporaryLink,
    getThumbnail,
  };
}
