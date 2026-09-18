/**
 * Challenge 38: Distributed Lock
 */

import { DistributedLock, createLock } from "./lock.service.ts";

async function run(): Promise<void> {
  console.log("Starting Distributed Lock...");
  try {
    const lock = createLock({ timeout: 30000, retries: 3, retryDelay: 100 });
    console.log("Lock created");
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();