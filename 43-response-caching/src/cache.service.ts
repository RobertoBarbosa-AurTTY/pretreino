/**
 * Desafio 43: Response Caching - Service
 */

export interface CacheEntry {
  key: string;
  response: unknown;
  headers: Record<string, string>;
  createdAt: string;
  expiresAt: string;
}

export interface CacheConfig {
  ttl: number;
  maxSize: number;
  strategy: "lru" | "lfu" | "fifo";
}

export interface ResponseCache {
  get(key: string): CacheEntry | null;
  set(key: string, response: unknown, headers?: Record<string, string>): void;
  invalidate(key: string): void;
  clear(): void;
  stats(): { hits: number; misses: number };
}

export function criarCache(config: CacheConfig): ResponseCache {
  // TODO: Implementar
  throw new Error("Não implementado");
}

export function generateCacheKey(req: Request): string {
  // TODO: Implementar
  throw new Error("Não implementado");
}