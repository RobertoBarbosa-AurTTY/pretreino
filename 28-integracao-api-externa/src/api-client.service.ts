/**
 * Challenge 28: External API Integration
 *
 * HTTP client for external API integration.
 */

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  /** Credentials used on POST /api/auth/login (mock API) */
  email?: string;
  password?: string;
  /** Pre-obtained token (skips login) */
  token?: string;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  circuitBreaker?: {
    failureThreshold: number;
    resetTimeoutMs: number;
  };
  /** How long GET responses stay cached (default: no cache) */
  cacheTtlMs?: number;
}

export interface ApiRequest<T> {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  data?: T;
  headers?: Record<string, string>;
  idempotencyKey?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    latency: number;
  };
}

export interface CircuitBreakerState {
  status: "closed" | "open" | "half-open";
  failures: number;
  lastFailure?: string;
  nextAttempt?: string;
}

export interface RateLimitState {
  remaining: number;
  reset: number;
  limited: boolean;
}

/**
 * ApiClient interface
 */
export interface ApiClient {
  /** Authenticate (POST /api/auth/login) and return the token */
  login(): Promise<string>;
  request<TRequest, TResponse>(
    request: ApiRequest<TRequest>,
  ): Promise<ApiResponse<TResponse>>;
  getCircuitBreakerState(): CircuitBreakerState;
  getRateLimitState(): RateLimitState;
  /** Register a fallback used when requests to `path` fail */
  configureFallback<T>(path: string, fallback: () => Promise<T>): void;
  clearCache(): void;
}

/**
 * Create API client
 */
export function createClient(config: ApiConfig): ApiClient {
  // TODO: Implement
  throw new Error("Not implemented");
}
