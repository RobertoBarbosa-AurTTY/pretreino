/**
 * Challenge 36: API Gateway - Service
 */

export interface Route {
  path: string;
  service: string;
  stripPrefix?: boolean;
}

export interface GatewayConfig {
  routes: Route[];
  port?: number;
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

export function proxyRequest(
  req: Request,
  targetUrl: string,
  stripPrefix?: boolean
): Promise<Response> {
  // TODO: Implement
  throw new Error("Not implemented");
}