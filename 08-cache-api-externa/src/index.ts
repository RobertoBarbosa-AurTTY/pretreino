/**
 * Challenge 8: External API Cache
 *
 * Caching system for external API calls.
 * API docs: ../API.md
 */

import { Cache, fetchProducts, fetchUsers, login } from "./cache.service.ts";

/**
 * Main pipeline
 */
async function executeCache(): Promise<void> {
  console.log("Starting cache demonstration...");

  try {
    // .env configurations
    const apiUrl = Deno.env.get("API_BASE_URL") ||
      "https://api-mock-98te.onrender.com";
    const apiEmail = Deno.env.get("API_EMAIL") || "joao@email.com";
    const apiPassword = Deno.env.get("API_PASSWORD") || "123456";
    const ttl = parseInt(Deno.env.get("CACHE_TTL") || "300");
    const maxEntries = parseInt(Deno.env.get("CACHE_MAX_ENTRIES") || "1000");
    const persist = Deno.env.get("CACHE_PERSISTIR") === "true";
    const filePath = Deno.env.get("CACHE_ARQUIVO") || "./output/cache.json";

    console.log(`API URL: ${apiUrl}`);
    console.log(`TTL: ${ttl}s`);

    // Create cache instance
    const cache = new Cache<unknown[]>({
      defaultTtl: ttl,
      maxEntries,
      persist,
      filePath,
    });

    // TODO: Implement demonstration
    // 1. Log in to get the token
    // 2. Fetch data with and without cache (measure the time of each call)
    // 3. Show statistics
    // 4. Invalidate cache

    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error on demonstration:", error);
    throw error;
  }
}

// Execution
executeCache();
