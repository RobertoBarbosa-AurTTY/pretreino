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

export interface WebhookService {
  register(webhook: Omit<Webhook, "id">): Webhook;
  unregister(id: string): void;
  trigger(event: string, payload: unknown): Promise<void>;
  getDeliveries(webhookId: string): WebhookDelivery[];
}

export function createService(): WebhookService {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function signPayload(payload: unknown, secret: string): string {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function verifySignature(
  payload: unknown,
  signature: string,
  secret: string
): boolean {
  // TODO: Implement
  throw new Error("Not implemented");
}