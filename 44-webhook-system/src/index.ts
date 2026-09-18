/**
 * Challenge 44: Webhook System
 */

import { WebhookService, createService } from "./webhook.service.ts";

async function run(): Promise<void> {
  console.log("Starting Webhook System...");
  try {
    const service = createService();
    console.log("Service created");
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();