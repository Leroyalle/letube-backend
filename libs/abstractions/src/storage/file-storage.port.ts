import type { Readable } from 'stream';

type MediaStorage = 'public' | 'private';

export interface FileStoragePort {
  getSecureUrl: (key: string, storage: MediaStorage, method: 'PUT' | 'GET') => Promise<string>;
  get: (key: string, storage: MediaStorage) => Promise<Readable | undefined>;
  put: (key: string, stream: Readable, storage: MediaStorage) => Promise<void>;
  exists: (key: string, storage: MediaStorage) => Promise<boolean>;
  uploadFolder: (localPath: string, remotePrefix: string, storage: MediaStorage) => Promise<void>;
  getBucket: (storage: MediaStorage) => string;
}
