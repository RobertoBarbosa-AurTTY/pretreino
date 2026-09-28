/**
 * Challenge 33: Event Sourcing - Service
 */

export interface Event {
  id: string;
  aggregateId: string;
  type: string; // "AccountOpened" | "MoneyDeposited" | "MoneyWithdrawn" | "AccountClosed"
  data: unknown;
  timestamp: string;
  version: number;
}

/**
 * State of the example aggregate: a bank account.
 */
export interface AccountState {
  id: string;
  owner: string;
  balance: number;
  status: "open" | "closed";
}

export interface Snapshot {
  aggregateId: string;
  state: AccountState;
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

export function applyEvent(
  state: AccountState | null,
  event: Event,
): AccountState {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function reconstructState(
  events: Event[],
  snapshot?: Snapshot,
): AccountState | null {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Projection: current balance per aggregateId.
 */
export function buildBalanceProjection(
  events: Event[],
): Record<string, number> {
  // TODO: Implement
  throw new Error("Not implemented");
}
