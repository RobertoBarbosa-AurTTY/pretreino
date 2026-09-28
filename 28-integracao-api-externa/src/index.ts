/**
 * Challenge 28: External API Integration
 *
 * Robust HTTP client for external API integration.
 */

import { createClient } from "./api-client.service.ts";

/**
 * Main pipeline
 */
async function runIntegration(): Promise<void> {
  console.log("Starting external API integration...");

  try {
    // .env settings
    const apiUrl = Deno.env.get("API_BASE_URL") ||
      "https://api-mock-98te.onrender.com";
    const email = Deno.env.get("API_EMAIL");
    const password = Deno.env.get("API_PASSWORD");
    const timeout = parseInt(Deno.env.get("API_TIMEOUT") || "5000");
    const maxRetries = parseInt(Deno.env.get("MAX_RETRIES") || "3");

    console.log(`API URL: ${apiUrl}`);
    console.log(`Timeout: ${timeout}ms`);
    console.log(`Max retries: ${maxRetries}`);

    // TODO: Implement pipeline
    // 1. Create client (with email/password for login)
    // 2. Make requests (e.g. GET /api/produtos, POST /api/emails?fail=true)
    // 3. Handle errors
    // 4. Check circuit breaker

    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error in integration:", error);
    throw error;
  }
}

// Execution
runIntegration();
