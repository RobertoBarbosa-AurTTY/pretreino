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
  /** Intervalo entre health checks, em milissegundos. */
  healthCheckInterval: number;
  backends: Backend[];
}

export interface LoadBalancer {
  /** Escolhe um backend saudável e incrementa `connections`. */
  getNextBackend(clientIp?: string): Backend | null;
  /** Libera uma conexão do backend (decrementa `connections`, mínimo 0). */
  releaseBackend(id: string): void;
  addBackend(backend: Backend): void;
  removeBackend(id: string): void;
  getBackends(): Backend[];
  setHealth(id: string, healthy: boolean): void;
  /** Faz `GET http://host:port/health` em cada backend e atualiza `healthy`. */
  runHealthChecks(): Promise<void>;
}

export function createLoadBalancer(config: LoadBalancerConfig): LoadBalancer {
  // TODO: Implement
  throw new Error("Not implemented");
}
