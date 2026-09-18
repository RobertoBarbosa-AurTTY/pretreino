/**
 * Challenge 40: Event Driven Architecture
 */

import { EventBus, createEventBus } from "./eventbus.service.ts";

async function run(): Promise<void> {
  console.log("Starting Event Driven...");
  try {
    const bus = createEventBus();
    console.log("Event Bus created");
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();