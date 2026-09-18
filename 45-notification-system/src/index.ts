/**
 * Challenge 45: Notification System
 */

import { NotificationService, createService } from "./notification.service.ts";

async function run(): Promise<void> {
  console.log("Starting Notification System...");
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