/**
 * Challenge 34: CQRS
 */

import { CommandBus, QueryBus } from "./cqrs.service.ts";

async function run(): Promise<void> {
  console.log("Starting CQRS...");
  try {
    const commandBus = new CommandBus();
    const queryBus = new QueryBus();
    console.log("Buses created");
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();