/**
 * Challenge 32: API Versioning
 */

import { createRouter } from "./versioning.service.ts";

async function run(): Promise<void> {
  console.log("Starting versioned API...");
  try {
    const port = parseInt(Deno.env.get("PORT") || "3000");
    console.log(`Port: ${port}`);
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();