/**
 * Challenge 10: Metrics Dashboard
 * 
 * Service that collects, processes and serves application metrics.
 * The Mock API must be running: cd ../mock-api && deno task dev
 */

import { 
  registerMetric, 
  fetchMetrics, 
  aggregateMetrics,
  generateSimulatedMetrics 
} from "./metric.service.ts";

/**
 * Main pipeline
 */
async function executeDashboard(): Promise<void> {
  console.log("Starting metrics dashboard...");
  
  try {
    // .env configurations
    const apiUrl = Deno.env.get("API_BASE_URL") || "http://localhost:8080";
    
    console.log(`API URL: ${apiUrl}`);
    
    // TODO: Implement pipeline
    // 1. Generate simulated metrics
    // 2. Fetch metrics
    // 3. Aggregate and show statistics
    
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error on dashboard:", error);
    throw error;
  }
}

// Execution
executeDashboard();