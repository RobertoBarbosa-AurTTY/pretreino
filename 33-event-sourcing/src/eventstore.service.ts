/**
 * Desafio 33: Event Sourcing - Service
 */

export interface Event {
  id: string;
  aggregateId: string;
  tipo: string;
  dados: unknown;
  timestamp: string;
  version: number;
}

export interface Snapshot {
  aggregateId: string;
  state: unknown;
  version: number;
  timestamp: string;
}

export interface EventStore {
  append(event: Omit<Event, "id" | "timestamp">): Event;
  getEvents(aggregateId: string): Event[];
  getSnapshot(aggregateId: string): Snapshot | null;
  saveSnapshot(snapshot: Omit<Snapshot, "timestamp">): void;
}

export function criarEventStore(): EventStore {
  // TODO: Implementar
  throw new Error("Não implementado");
}

export function aplicarEvento(state: unknown, event: Event): unknown {
  // TODO: Implementar
  throw new Error("Não implementado");
}

export function reconstruirEstado(events: Event[]): unknown {
  // TODO: Implementar
  throw new Error("Não implementado");
}