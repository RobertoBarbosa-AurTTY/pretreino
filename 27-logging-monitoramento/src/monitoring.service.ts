/**
 * Challenge 27: Logging and Monitoring
 *
 * Structured logging and monitoring service.
 */

export interface LogEntry {
  level: "debug" | "info" | "warn" | "error" | "fatal";
  message: string;
  timestamp: string;
  context: {
    requestId?: string;
    userId?: string;
    action?: string;
    [key: string]: unknown;
  };
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface Metric {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: string;
}

export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operation: string;
  startTime: string;
  endTime: string;
  status: "ok" | "error";
  attributes: Record<string, unknown>;
}

export interface AlertRule {
  metric: string;
  condition: "gt" | "lt" | "eq";
  threshold: number;
  window: number;
  action: "log" | "webhook" | "email";
}

/**
 * Create structured logger
 */
export function createLogger(service: string, level?: string): Logger {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Register log: adds the timestamp and writes the entry as one JSON line
 * (debug/info -> console.log, warn -> console.warn, error/fatal -> console.error)
 */
export function registerLog(entry: Omit<LogEntry, "timestamp">): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Register metric
 */
export function createMetric(
  name: string,
  value: number,
  tags?: Record<string, string>,
): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * List registered metrics, optionally filtered by name
 */
export function getMetrics(name?: string): Metric[] {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Start trace span
 */
export function startTracing(
  operation: string,
  traceId?: string,
  parentSpanId?: string,
): TraceSpan {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Finish trace span
 */
export function finishSpan(
  span: TraceSpan,
  status: "ok" | "error",
): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Configure alerts (replaces previous rules). Rules are evaluated on each
 * createMetric call using the average value within the rule window.
 */
export function configureAlerts(
  rules: AlertRule[],
  onAlert?: (rule: AlertRule, metric: Metric) => void,
): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Logger interface
 */
export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  fatal(message: string, context?: Record<string, unknown>): void;
}
