/**
 * Challenge 39: Idempotency
 */

import { IdempotencyService, createService } from "./idempotency.service.ts";

async function run(): Promise<void> {
  console.log("Starting Idempotency...");
  try {
    const service = createService(3600000);
    console.log("Service created");
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();