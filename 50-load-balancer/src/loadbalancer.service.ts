/**
 * Challenge 50: Load Balancer - Service
 */

export interface Backend {
  id: string;
  host: string;
  port: number;
  weight: number;
  healthy: boolean;
  connections: number;
}

export interface LoadBalancerConfig {
  strategy: "roundRobin" | "leastConn" | "weighted" | "ipHash";
  healthCheckInterval: number;
  backends: Backend[];
}

export interface LoadBalancer {
  getNextBackend(): Backend | null;
  addBackend(backend: Backend): void;
  removeBackend(id: string): void;
  getBackends(): Backend[];
}

export function createLoadBalancer(config: LoadBalancerConfig): LoadBalancer {
  // TODO: Implement
  throw new Error("Not implemented");
}