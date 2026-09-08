/**
 * Desafio 28: Integração com API Externa
 * 
 * Cliente HTTP para integração com APIs externas.
 */

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

interface ApiRequest<T> {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  data?: T;
  headers?: Record<string, string>;
  idempotencyKey?: string;
}

interface ApiResponse<T> {
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

interface CircuitBreakerState {
  status: "closed" | "open" | "half-open";
  failures: number;
  lastFailure?: string;
  nextAttempt?: string;
}

interface RateLimitState {
  remaining: number;
  reset: number;
  limited: boolean;
}

/**
 * Cria cliente API
 */
export function criarCliente(config: ApiConfig): ApiClient {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Faz requisição
 */
export async function fazerRequisicao<TRequest, TResponse>(
  request: ApiRequest<TRequest>
): Promise<ApiResponse<TResponse>> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Obtém estado do circuit breaker
 */
export function obterEstadoCircuitBreaker(): CircuitBreakerState {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Configura fallback
 */
export function configurarFallback<T>(
  path: string,
  fallback: () => Promise<T>
): void {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * ApiClient interface
 */
interface ApiClient {
  request<TRequest, TResponse>(
    request: ApiRequest<TRequest>
  ): Promise<ApiResponse<TResponse>>;
  getCircuitBreakerState(): CircuitBreakerState;
  clearCache(): void;
}