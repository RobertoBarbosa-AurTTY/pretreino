/**
 * Challenge 46: File Storage - Service
 */

export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  createdAt: string;
}

export interface StorageConfig {
  basePath: string;
  maxFileSize?: number;
  allowedTypes?: string[];
}

export interface UploadResult {
  success: boolean;
  file?: FileMetadata;
  error?: string;
}

export interface FileStorage {
  upload(file: File, metadata?: Record<string, unknown>): Promise<UploadResult>;
  get(id: string): FileMetadata | null;
  delete(id: string): Promise<boolean>;
  list(): FileMetadata[];
}

export function createStorage(config: StorageConfig): FileStorage {
  // TODO: Implement
  throw new Error("Not implemented");
}