import { useState, useCallback } from 'react';
import { api } from '../api';

interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  disabled: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
}

interface FirestoreCollection {
  id: string;
  path: string;
  documentCount: number;
}

interface FirestoreDocument {
  id: string;
  data: Record<string, any>;
  createTime: string;
  updateTime: string;
}

interface FirebaseStorageBucket {
  name: string;
  location: string;
  storageClass: string;
}

interface FirebaseStorageFile {
  name: string;
  bucket: string;
  size: number;
  contentType: string;
  updated: string;
}

export function useFirebase() {
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [collections, setCollections] = useState<FirestoreCollection[]>([]);
  const [documents, setDocuments] = useState<FirestoreDocument[]>([]);
  const [storageBuckets, setStorageBuckets] = useState<FirebaseStorageBucket[]>([]);
  const [storageFiles, setStorageFiles] = useState<FirebaseStorageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth operations
  const fetchUsers = useCallback(async (maxResults: number = 100) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/firebase/auth/users?maxResults=${maxResults}`);
      setUsers(response.data.users || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Firebase users');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/firebase/auth/users', {
        email,
        password,
        displayName,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (uid: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/integrations/firebase/auth/users/${uid}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Firestore operations
  const fetchCollections = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/firebase/firestore/collections?projectId=${projectId}`);
      setCollections(response.data.collections || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocuments = useCallback(async (collectionPath: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/firebase/firestore/documents?collection=${encodeURIComponent(collectionPath)}`);
      setDocuments(response.data.documents || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDocument = useCallback(async (collectionPath: string, data: Record<string, any>, documentId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/firebase/firestore/documents', {
        collection: collectionPath,
        data,
        documentId,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDocument = useCallback(async (documentPath: string, data: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/api/integrations/firebase/firestore/documents`, {
        document: documentPath,
        data,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (documentPath: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/integrations/firebase/firestore/documents?document=${encodeURIComponent(documentPath)}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Storage operations
  const fetchStorageBuckets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/integrations/firebase/storage/buckets');
      setStorageBuckets(response.data.buckets || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch storage buckets');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStorageFiles = useCallback(async (bucketName: string, prefix: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/firebase/storage/files?bucket=${bucketName}&prefix=${encodeURIComponent(prefix)}`);
      setStorageFiles(response.data.files || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch storage files');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = useCallback(async (bucketName: string, path: string, content: string, contentType: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/firebase/storage/upload', {
        bucket: bucketName,
        path,
        content,
        contentType,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (bucketName: string, path: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/integrations/firebase/storage/files?bucket=${bucketName}&path=${encodeURIComponent(path)}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete file');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDownloadUrl = useCallback(async (bucketName: string, path: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/firebase/storage/download?bucket=${bucketName}&path=${encodeURIComponent(path)}`);
      return response.data.url;
    } catch (err: any) {
      setError(err.message || 'Failed to get download URL');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    collections,
    documents,
    storageBuckets,
    storageFiles,
    loading,
    error,
    // Auth
    fetchUsers,
    createUser,
    deleteUser,
    // Firestore
    fetchCollections,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    // Storage
    fetchStorageBuckets,
    fetchStorageFiles,
    uploadFile,
    deleteFile,
    getDownloadUrl,
  };
}
