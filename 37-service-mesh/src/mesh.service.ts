/**
 * Challenge 37: Service Mesh - Service
 */

export interface ServiceInstance {
  id: string;
  host: string;
  port: number;
  metadata: Record<string, string>;
}

export interface TrafficPolicy {
  loadBalancer: "roundRobin" | "leastConn" | "random";
  timeout: number;
  retries: number;
}

export interface MeshConfig {
  services: ServiceInstance[];
  policy: TrafficPolicy;
  mtls: boolean;
}

export interface ServiceMesh {
  registerService(service: ServiceInstance): void;
  discovery(name: string): ServiceInstance | null;
  route(req: Request): Promise<Response>;
}

export function createMesh(config: MeshConfig): ServiceMesh {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function loadBalance(
  services: ServiceInstance[],
  strategy: string
): ServiceInstance {
  // TODO: Implement
  throw new Error("Not implemented");
}