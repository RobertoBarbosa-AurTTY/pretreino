/**
 * Challenge 23: Redis Cache
 *
 * Cache service using Redis.
 */

export interface CacheConfig {
  prefix: string;
  ttl: number;
  serialize?: boolean;
}

export interface CacheResult<T> {
  hit: boolean;
  data: T | null;
  fromCache: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  keysCount: number;
}

/**
 * Minimal key-value store used by the cache. A Redis client (via an adapter)
 * implements it in production; tests use an in-memory fake.
 */
export interface CacheStore {
  get(key: string): Promise<string | null>;
  /** ttl in seconds */
  set(key: string, value: string, ttl: number): Promise<void>;
  /** returns how many keys were removed */
  del(...keys: string[]): Promise<number>;
  /** glob pattern, e.g. "app:user:*" */
  keys(pattern: string): Promise<string[]>;
}

/**
 * Configure key prefix and default TTL
 */
export function configureCache(config: CacheConfig): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Use a custom store (e.g. an in-memory store in tests). Resets statistics.
 */
export function useStore(store: CacheStore): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Connect to Redis
 */
export async function connectRedis(url: string): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Disconnect from Redis
 */
export async function disconnectRedis(): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Get cache value
 */
export async function getCache<T>(key: string): Promise<CacheResult<T>> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Set cache value
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl?: number,
): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Cache-aside: return cached value or load it, store it and return it
 */
export async function getOrSet<T>(
  key: string,
  loader: () => Promise<T>,
  ttl?: number,
): Promise<T> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Invalidate cache by key
 */
export async function invalidateCache(key: string): Promise<boolean> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Invalidate cache by pattern
 */
export async function invalidateCacheByPattern(
  pattern: string,
): Promise<number> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Return cache statistics
 */
export async function getCacheStats(): Promise<CacheStats> {
  // TODO: Implement
  throw new Error("Not implemented");
}
