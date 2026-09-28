/**
 * Challenge 10: Metrics Dashboard
 *
 * Service that collects, processes and serves application metrics.
 * API docs: ../API.md
 */

export interface Metric {
  name: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}

export interface AggregatedMetric {
  name: string;
  average: number;
  minimum: number;
  maximum: number;
  p95: number;
  p99: number;
  count: number;
  period: { start: string; end: string };
}

/**
 * Authenticates on the Mock API and returns the Bearer token
 */
export async function login(
  apiUrl: string,
  email: string,
  password: string,
): Promise<string> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Registers metric in the Mock API (POST /api/metricas)
 */
export async function registerMetric(
  metric: Omit<Metric, "timestamp">,
  apiUrl: string,
  token: string,
): Promise<boolean> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Fetches metrics from the Mock API (GET /api/metricas?name=...)
 */
export async function fetchMetrics(
  name: string,
  apiUrl: string,
  token: string,
): Promise<Metric[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Aggregates metrics calculating statistics
 */
export function aggregateMetrics(metrics: Metric[]): AggregatedMetric | null {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Calculates percentile (nearest-rank method)
 */
export function calculatePercentile(
  values: number[],
  percentile: number,
): number {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Generates `count` simulated metrics named `name` and sends them to the API
 */
export async function generateSimulatedMetrics(
  apiUrl: string,
  token: string,
  name: string,
  count: number,
): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}
