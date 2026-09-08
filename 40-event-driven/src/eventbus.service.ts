/**
 * Desafio 40: Event Driven - Service
 */

export interface Event {
  id: string;
  type: string;
  payload: unknown;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface EventHandler {
  handle(event: Event): Promise<void>;
}

export interface EventBus {
  publish(event: Event): Promise<void>;
  subscribe(type: string, handler: EventHandler): void;
  unsubscribe(type: string, handler: EventHandler): void;
}

export function criarEventBus(): EventBus {
  // TODO: Implementar
  throw new Error("Não implementado");
}