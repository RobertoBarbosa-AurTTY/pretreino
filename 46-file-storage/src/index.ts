/**
 * Challenge 46: File Storage
 */

import { FileStorage, createStorage } from "./storage.service.ts";

async function run(): Promise<void> {
  console.log("Starting File Storage...");
  try {
    const storage = createStorage({ basePath: "./uploads" });
    console.log("Storage created");
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();