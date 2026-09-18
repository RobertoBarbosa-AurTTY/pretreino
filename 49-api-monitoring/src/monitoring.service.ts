/**
 * Challenge 49: API Monitoring - Service
 */

export interface ApiMetric {
  endpoint: string;
  method: string;
  statusCode: number;
  latency: number;
  timestamp: string;
}

export interface AlertRule {
  name: string;
  condition: "error_rate" | "latency_p99" | "uptime";
  threshold: number;
  window: number;
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "down";
  checks: Record<string, boolean>;
}

export interface MonitoringService {
  recordMetric(metric: ApiMetric): void;
  getMetrics(endpoint: string, window: number): ApiMetric[];
  checkHealth(): HealthStatus;
  addAlert(rule: AlertRule): void;
}

export function createService(): MonitoringService {
  // TODO: Implement
  throw new Error("Not implemented");
}