/**
 * Challenge 47: Search Engine
 */

import { SearchEngine, createEngine } from "./search.service.ts";

async function run(): Promise<void> {
  console.log("Starting Search Engine...");
  try {
    const engine = createEngine();
    console.log("Engine created");
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();