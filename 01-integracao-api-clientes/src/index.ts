/**
 * Challenge 1: Customers API Integration
 *
 * Consume a REST API, filter active clients and save to a file.
 * The Mock API must be running: cd ../mock-api && deno task dev
 */

import {
  fetchClients,
  APIConfig,
  filterActive,
  saveToFile,
} from "./client.service.ts";

/**
 * Main pipeline
 *
 * Implement the sequence:
 * 1. Fetch clients from the API
 * 2. Filter only active ones
 * 3. Save to a JSON file
 */
async function executePipeline(config: APIConfig): Promise<void> {
  const clients = await fetchClients(config);
  console.log(clients);
  console.log("--------------------------------");
  console.log(filterActive(clients));
  await saveToFile(clients);
  console.log("Clients saved to JSON");
}

// Execution
const config: APIConfig = {
  url: Deno.env.get("API_BASE_URL") || "http://localhost:8080",
  timeout: parseInt(Deno.env.get("API_TIMEOUT") || "5000"),
  retries: parseInt(Deno.env.get("API_RETRIES") || "3"),
};

try {
  await executePipeline(config);
} catch {
  Deno.exit(1);
}