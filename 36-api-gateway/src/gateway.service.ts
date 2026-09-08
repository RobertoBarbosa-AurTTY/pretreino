/**
 * Desafio 36: API Gateway - Service
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

export function criarGateway(config: GatewayConfig): Gateway {
  // TODO: Implementar
  throw new Error("Não implementado");
}

export function proxyRequest(
  req: Request,
  targetUrl: string,
  stripPrefix?: boolean
): Promise<Response> {
  // TODO: Implementar
  throw new Error("Não implementado");
}