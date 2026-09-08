/**
 * Desafio 44: Webhook System - Service
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

export interface WebhookService {
  register(webhook: Omit<Webhook, "id">): Webhook;
  unregister(id: string): void;
  trigger(event: string, payload: unknown): Promise<void>;
  getDeliveries(webhookId: string): WebhookDelivery[];
}

export function criarServico(): WebhookService {
  // TODO: Implementar
  throw new Error("Não implementado");
}

export function signPayload(payload: unknown, secret: string): string {
  // TODO: Implementar
  throw new Error("Não implementado");
}

export function verifySignature(
  payload: unknown,
  signature: string,
  secret: string
): boolean {
  // TODO: Implementar
  throw new Error("Não implementado");
}