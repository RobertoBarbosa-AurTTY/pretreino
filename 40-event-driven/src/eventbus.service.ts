/**
 * Challenge 40: Event Driven - Service
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

export interface DeadLetter {
  event: Event;
  error: string;
  attempts: number;
  failedAt: string;
}

export interface EventBusOptions {
  maxRetries?: number; // extra attempts per handler before dead-lettering (default 0)
}

export interface EventBus {
  publish(event: Event): Promise<void>;
  subscribe(type: string, handler: EventHandler): void;
  unsubscribe(type: string, handler: EventHandler): void;
  getHistory(): Event[];
  getDeadLetters(): DeadLetter[];
  replay(filter?: { type?: string; since?: string }): Promise<number>;
}

export function createEventBus(options?: EventBusOptions): EventBus {
  // TODO: Implement
  throw new Error("Not implemented");
}
