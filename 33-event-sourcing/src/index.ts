/**
 * Challenge 33: Event Sourcing
 */

import { EventStore, createEventStore } from "./eventstore.service.ts";

async function run(): Promise<void> {
  console.log("Starting Event Sourcing...");
  try {
    const store = createEventStore();
    console.log("Event Store created");
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();