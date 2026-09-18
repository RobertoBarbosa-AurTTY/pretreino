/**
 * Challenge 36: API Gateway
 */

import { Gateway, createGateway } from "./gateway.service.ts";

async function run(): Promise<void> {
  console.log("Starting API Gateway...");
  try {
    const gateway = createGateway({
      routes: [
        { path: "/api/users", service: "http://localhost:3001" },
        { path: "/api/orders", service: "http://localhost:3002" }
      ]
    });
    console.log("Gateway created");
    // TODO: Implement
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

run();