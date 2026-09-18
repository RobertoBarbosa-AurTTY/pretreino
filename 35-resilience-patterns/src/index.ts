/**
 * Challenge 35: Resilience Patterns
 */

import { CircuitBreaker, Bulkhead, Retry } from "./resilience.service.ts";

async function run(): Promise<void> {
  console.log("Starting Resilience Patterns...");
  try {
    const cb = new CircuitBreaker(5, 60000);
    const bulkhead = new Bulkhead(10, 5);
    console.log("Patterns created");
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();