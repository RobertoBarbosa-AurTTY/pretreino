/**
 * Challenge 8: External API Cache
 * 
 * Caching system for external API calls.
 * The Mock API must be running: cd ../mock-api && deno task dev
 */

import { Cache, fetchUsers, fetchProducts } from "./cache.service.ts";

/**
 * Main pipeline
 */
async function executeCache(): Promise<void> {
  console.log("Starting cache demonstration...");
  
  try {
    // .env configurations
    const apiUrl = Deno.env.get("API_EXTERNA_URL") || "http://localhost:8080";
    const ttl = parseInt(Deno.env.get("CACHE_TTL") || "300");
    const maxEntries = parseInt(Deno.env.get("CACHE_MAX_ENTRIES") || "1000");
    
    console.log(`API URL: ${apiUrl}`);
    console.log(`TTL: ${ttl}s`);
    
    // Create cache instance
    const cache = new Cache<unknown[]>({
      defaultTtl: ttl,
      maxEntries,
      persist: false
    });
    
    // TODO: Implement demonstration
    // 1. Fetch data with and without cache
    // 2. Show statistics
    // 3. Invalidate cache
    
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error on demonstration:", error);
    throw error;
  }
}

// Execution
executeCache();