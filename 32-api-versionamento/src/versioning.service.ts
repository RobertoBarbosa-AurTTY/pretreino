/**
 * Challenge 32: API Versioning - Service
 */

export interface ApiVersion {
  version: string; // e.g. "v1"
  status: "ativa" | "deprecada" | "obsoleta";
  deprecationDate?: string;
  removalDate?: string;
}

export type Handler = (req: Request) => Response | Promise<Response>;

export interface Router {
  get(version: string, path: string, handler: Handler): void;
  post(version: string, path: string, handler: Handler): void;
  handle(req: Request): Promise<Response>;
}

export function createRouter(versions: ApiVersion[]): Router {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function versioningMiddleware(req: Request): Request {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function addDeprecationHeaders(
  response: Response,
  version: ApiVersion,
): Response {
  // TODO: Implement
  throw new Error("Not implemented");
}
