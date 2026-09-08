/**
 * Desafio 39: Idempotency - Service
 */

export interface IdempotencyKey {
  key: string;
  request: unknown;
  response?: unknown;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  expiresAt: string;
}

export interface IdempotencyResult {
  isNew: boolean;
  response?: unknown;
}

export interface IdempotencyService {
  check(key: string, request: unknown): Promise<IdempotencyResult>;
  save(key: string, response: unknown): Promise<void>;
  fail(key: string): Promise<void>;
}

export function criarServico(ttlMs: number): IdempotencyService {
  // TODO: Implementar
  throw new Error("Não implementado");
}