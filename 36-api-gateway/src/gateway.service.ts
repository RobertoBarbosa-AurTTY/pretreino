/**
 * Challenge 36: API Gateway - Service
 */

export interface Route {
  path: string; // path prefix, e.g. "/api/users"
  service: string; // upstream base URL, e.g. "http://localhost:3001"
  stripPrefix?: boolean;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface GatewayConfig {
  routes: Route[];
  port?: number;
  apiKey?: string; // when set, requests must send header X-API-Key
  rateLimit?: RateLimitConfig; // per client (header X-Forwarded-For)
}

export interface Gateway {
  addRoute(route: Route): void;
  removeRoute(path: string): void;
  handle(req: Request): Promise<Response>;
}

export function createGateway(config: GatewayConfig): Gateway {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function proxyRequest(req: Request, route: Route): Promise<Response> {
  // TODO: Implement
  throw new Error("Not implemented");
}
