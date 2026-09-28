/**
 * Challenge 10: Metrics Dashboard
 *
 * Service that collects, processes and serves application metrics.
 * API docs: ../API.md
 */

import {
  aggregateMetrics,
  fetchMetrics,
  generateSimulatedMetrics,
  login,
} from "./metric.service.ts";

/**
 * Main pipeline
 */
async function executeDashboard(): Promise<void> {
  console.log("Starting metrics dashboard...");

  try {
    // .env configurations
    const apiUrl = Deno.env.get("API_BASE_URL") ||
      "https://api-mock-98te.onrender.com";
    const apiEmail = Deno.env.get("API_EMAIL") || "joao@email.com";
    const apiPassword = Deno.env.get("API_PASSWORD") || "123456";
    const metricName = Deno.env.get("METRICA_NOME") || "response_time";
    const simulatedCount = parseInt(
      Deno.env.get("METRICAS_SIMULADAS") || "10",
    );

    console.log(`API URL: ${apiUrl}`);
    console.log(`Metric: ${metricName}`);

    // TODO: Implement pipeline
    // 1. Log in to get the token
    // 2. Generate simulated metrics
    // 3. Fetch metrics
    // 4. Aggregate and show statistics (average, min, max, p95, p99)

    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error on dashboard:", error);
    throw error;
  }
}

// Execution
executeDashboard();
