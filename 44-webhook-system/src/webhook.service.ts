/**
 * Challenge 44: Webhook System - Service
 */

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: unknown;
  status: "pending" | "success" | "failed";
  attempts: number;
  lastError?: string;
}

export interface WebhookServiceOptions {
  /** Número máximo de tentativas por entrega (padrão: 3). */
  maxAttempts?: number;
  /** Atraso base do backoff exponencial, em ms (padrão: 1000). */
  baseDelayMs?: number;
}

export interface WebhookService {
  register(webhook: Omit<Webhook, "id">): Webhook;
  unregister(id: string): void;
  trigger(event: string, payload: unknown): Promise<void>;
  getDeliveries(webhookId: string): WebhookDelivery[];
}

export function createService(
  options: WebhookServiceOptions = {},
): WebhookService {
  // TODO: Implement
  throw new Error("Not implemented");
}

export async function signPayload(
  payload: unknown,
  secret: string,
): Promise<string> {
  // TODO: Implement
  throw new Error("Not implemented");
}

export async function verifySignature(
  payload: unknown,
  signature: string,
  secret: string,
): Promise<boolean> {
  // TODO: Implement
  throw new Error("Not implemented");
}
