/**
 * Challenge 8: External API Cache
 *
 * Caching system for external API calls.
 * API docs: ../API.md
 */

export interface CacheEntry<T> {
  key: string;
  data: T;
  expiresAt: number;
  hits: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
}

export interface CacheConfig {
  /** Default TTL in seconds */
  defaultTtl: number;
  maxEntries: number;
  persist: boolean;
  /** JSON file used when `persist` is true */
  filePath?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private config: CacheConfig;
  private stats = { hits: 0, misses: 0 };

  constructor(config: CacheConfig) {
    this.config = config;
  }

  /**
   * Fetches data from the cache (null if missing or expired)
   */
  async get(key: string): Promise<T | null> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Saves data to the cache (ttl in seconds)
   */
  async set(key: string, data: T, ttl?: number): Promise<void> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Returns cached data or calls fetchFn and caches the result
   */
  async getOrFetch(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Invalidates a cache entry
   */
  async invalidate(key: string): Promise<boolean> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Clears the whole cache
   */
  async clear(): Promise<void> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Returns cache statistics
   */
  getStats(): CacheStats {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Removes least used entry
   */
  private removeLeastUsed(): void {
    // TODO: Implement
    throw new Error("Not implemented");
  }
}

/**
 * Authenticates on the Mock API and returns the Bearer token
 */
export async function login(
  apiUrl: string,
  email: string,
  password: string,
): Promise<string> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Fetches users from the external API (GET /api/usuarios)
 */
export async function fetchUsers(
  apiUrl: string,
  token: string,
): Promise<User[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Fetches products from the external API (GET /api/produtos)
 */
export async function fetchProducts(
  apiUrl: string,
  token: string,
): Promise<Product[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}
