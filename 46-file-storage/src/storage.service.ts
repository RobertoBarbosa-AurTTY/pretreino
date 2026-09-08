/**
 * Desafio 46: File Storage - Service
 */

export interface FileMetadata {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  caminho: string;
  criadoEm: string;
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

export function criarStorage(config: StorageConfig): FileStorage {
  // TODO: Implementar
  throw new Error("Não implementado");
}