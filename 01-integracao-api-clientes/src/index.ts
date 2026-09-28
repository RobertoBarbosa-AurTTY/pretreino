/**
 * Challenge 1: Customers API Integration
 *
 * Consume a REST API, filter active clients and save to a file.
 * API docs: ../API.md
 */

import {
  type APIConfig,
  fetchClients,
  filterActive,
  login,
  saveToFile,
} from "./client.service.ts";

/**
 * Main pipeline
 *
 * Implement the sequence:
 * 1. Log in to get the token
 * 2. Fetch clients from the API
 * 3. Filter only active ones
 * 4. Save to a JSON file (outputPath)
 */
async function executePipeline(
  config: APIConfig,
  outputPath: string,
): Promise<void> {
  // TODO: Implement pipeline
  throw new Error("Not implemented");
}

// Execution
const config: APIConfig = {
  url: Deno.env.get("API_BASE_URL") || "https://api-mock-98te.onrender.com",
  email: Deno.env.get("API_EMAIL") || "joao@email.com",
  password: Deno.env.get("API_PASSWORD") || "123456",
  timeout: parseInt(Deno.env.get("API_TIMEOUT") || "5000"),
  retries: parseInt(Deno.env.get("API_RETRIES") || "3"),
};

const outputDir = Deno.env.get("OUTPUT_DIR") || "./output";
const outputFile = Deno.env.get("OUTPUT_FILE") || "clientes-ativos.json";

try {
  await executePipeline(config, `${outputDir}/${outputFile}`);
} catch (error) {
  console.error("Pipeline failed:", error);
  Deno.exit(1);
}
