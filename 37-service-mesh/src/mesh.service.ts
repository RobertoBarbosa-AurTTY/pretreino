/**
 * Challenge 37: Service Mesh - Service
 */

export interface ServiceInstance {
  id: string;
  name: string; // logical service name, e.g. "users"
  host: string;
  port: number;
  metadata: Record<string, string>;
  activeConnections?: number; // used by the "leastConn" strategy
}

export type LoadBalancerStrategy = "roundRobin" | "leastConn" | "random";

export interface TrafficPolicy {
  loadBalancer: LoadBalancerStrategy;
  timeout: number;
  retries: number;
}

export interface MeshConfig {
  services: ServiceInstance[];
  policy: TrafficPolicy;
  mtls: boolean;
}

export interface TrafficMetrics {
  requests: number;
  errors: number;
}

export interface ServiceMesh {
  registerService(service: ServiceInstance): void;
  discovery(name: string): ServiceInstance | null;
  route(req: Request): Promise<Response>;
  getMetrics(): Record<string, TrafficMetrics>;
}

export interface LoadBalancer {
  pick(instances: ServiceInstance[]): ServiceInstance;
}

export function createMesh(config: MeshConfig): ServiceMesh {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function createLoadBalancer(
  strategy: LoadBalancerStrategy,
): LoadBalancer {
  // TODO: Implement
  throw new Error("Not implemented");
}
