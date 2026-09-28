# Desafio 37: Service Mesh

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Simular, em memória, as responsabilidades de um Service Mesh (como
Istio/Linkerd): descoberta de serviços, load balancing, roteamento com timeout e
retry, "mTLS" e métricas de tráfego entre microserviços.

## 📋 Contexto Real

Comunicação complexa entre serviços:

- Várias instâncias de cada serviço, que sobem e caem
- Observabilidade do tráfego (quantas requisições, quantos erros)
- Segurança na comunicação (mTLS)
- Load balancing e retry sem poluir o código de negócio

## 📐 Requisitos

Tudo fica em `src/mesh.service.ts`.

**`createLoadBalancer(strategy)` → `pick(instances)`**

- [ ] `roundRobin`: alterna entre as instâncias em ordem (`a, b, c, a, …`)
- [ ] `leastConn`: escolhe a instância com menor `activeConnections` (ausente =
      `0`)
- [ ] `random`: escolhe
      `instances[Math.floor(Math.random() * instances.length)]`
- [ ] Lista vazia lança erro

**`createMesh(config)`**

- [ ] `registerService(instance)` adiciona uma instância (além das de
      `config.services`)
- [ ] `discovery(name)` retorna uma instância com aquele `name`, escolhida pela
      estratégia de `config.policy.loadBalancer`; `null` se não houver
- [ ] `route(req)`: o **hostname** da URL é o nome do serviço
      (`http://orders/pedidos/1` → serviço `orders`)
- [ ] Encaminha para `http://host:port` + path + query da instância escolhida
      (ou `https://` se `config.mtls` for `true`), preservando método, headers e
      corpo
- [ ] Serviço sem instâncias → `503` (sem chamar `fetch`)
- [ ] Cada tentativa tem limite de `policy.timeout` ms; erro de rede, timeout ou
      status `>= 500` contam como falha
- [ ] Em caso de falha, tenta de novo (até `1 + policy.retries` tentativas no
      total), escolhendo a instância de novo pelo load balancer
- [ ] Se todas as tentativas falharem → `502`
- [ ] `getMetrics()` retorna, por nome de serviço, `requests` (chamadas a
      `route`) e `errors` (chamadas que terminaram em `502`)

## 🗂️ Estrutura dos Dados

```typescript
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
```

## 💡 Exemplo de Uso

```typescript
import { createMesh } from "./mesh.service.ts";

const mesh = createMesh({
  services: [
    { id: "u1", name: "users", host: "localhost", port: 3001, metadata: {} },
    { id: "u2", name: "users", host: "localhost", port: 3002, metadata: {} },
  ],
  policy: { loadBalancer: "roundRobin", timeout: 5000, retries: 2 },
  mtls: false,
});

const res = await mesh.route(new Request("http://users/perfil/42"));
// → GET http://localhost:3001/perfil/42 (ou 3002, alternando)

console.log(mesh.getMetrics()); // { users: { requests: 1, errors: 0 } }
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [AbortSignal.timeout() (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)
- [Fetch API (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [URL (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/URL)
- [Request.arrayBuffer() (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Request/arrayBuffer)
- [What is a service mesh? (Istio)](https://istio.io/latest/about/service-mesh/)

## 📝 Notas

- O corpo de uma `Request` só pode ser lido uma vez: para fazer retry, leia-o
  antes (`arrayBuffer()`) e reutilize
- O "mTLS" aqui é simulado trocando o esquema para `https://`; um mesh real usa
  certificados de cliente e servidor
- Para `leastConn`, incremente `activeConnections` antes da chamada e decremente
  no `finally`
- Para poucos serviços, a complexidade de um service mesh pode não valer a pena
