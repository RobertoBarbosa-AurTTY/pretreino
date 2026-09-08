/**
 * Desafio 32: Versionamento de API - Service
 */

interface ApiVersion {
  versao: string;
  status: "ativa" | "deprecada" | "obsoleta";
  dataDeprecacao?: string;
  dataRemocao?: string;
}

interface Router {
  get(path: string, handler: Function): void;
  post(path: string, handler: Function): void;
}

export function criarRouter(versoes: ApiVersion[]): Router {
  // TODO: Implementar
  throw new Error("Não implementado");
}

export function middlewareVersionamento(req: Request): Request {
  // TODO: Implementar
  throw new Error("Não implementado");
}

export function adicionarDeprecationHeaders(
  response: Response,
  versao: string
): Response {
  // TODO: Implementar
  throw new Error("Não implementado");
}