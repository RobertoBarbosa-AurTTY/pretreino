/**
 * Challenge 33: Event Sourcing - Service
 */

export interface Event {
  id: string;
  aggregateId: string;
  type: string;
  data: unknown;
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

export function createEventStore(): EventStore {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function applyEvent(state: unknown, event: Event): unknown {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function reconstructState(events: Event[]): unknown {
  // TODO: Implement
  throw new Error("Not implemented");
}