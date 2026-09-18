/**
 * Challenge 32: API Versioning - Service
 */

interface ApiVersion {
  version: string;
  status: "ativa" | "deprecada" | "obsoleta";
  deprecationDate?: string;
  removalDate?: string;
}

interface Router {
  get(path: string, handler: Function): void;
  post(path: string, handler: Function): void;
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
  version: string
): Response {
  // TODO: Implement
  throw new Error("Not implemented");
}