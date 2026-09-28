# Desafio 50: Load Balancer

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar um load balancer com as estratégias Round Robin, Least Connections,
Weighted Round Robin e IP Hash, além de health checks dos backends.

## 📋 Contexto Real

Quando uma instância da API não dá conta, você sobe várias e coloca um load
balancer (Nginx, HAProxy, AWS ALB) na frente. Ele precisa:

- Distribuir as requisições de forma justa (ou proporcional à capacidade)
- Tirar do pool backends que pararam de responder
- Às vezes manter o mesmo cliente no mesmo backend (sticky sessions)

## 📐 Requisitos

- [ ] `getNextBackend(clientIp?)` escolhe apenas entre backends com
      `healthy: true`, incrementa o `connections` do escolhido e o retorna; sem
      backend saudável → `null`
- [ ] `"roundRobin"`: percorre os backends saudáveis em ordem circular
      (`a, b, c, a, ...`)
- [ ] `"leastConn"`: escolhe o de menor `connections`; empate → o que vem
      primeiro na lista
- [ ] `"weighted"`: a cada ciclo de `soma dos pesos` chamadas, cada backend é
      escolhido exatamente `weight` vezes
- [ ] `"ipHash"`: o mesmo `clientIp` vai sempre para o mesmo backend enquanto o
      pool saudável não mudar; sem `clientIp`, cai para round robin
- [ ] `releaseBackend(id)` decrementa `connections` (nunca abaixo de `0`)
- [ ] `addBackend`, `removeBackend(id)` e `setHealth(id, healthy)` alteram o
      pool; `getBackends()` retorna todos (saudáveis ou não), na ordem de
      inserção
- [ ] `runHealthChecks()` faz `GET http://<host>:<port>/health` em todos os
      backends: resposta 2xx → `healthy: true`; outro status ou erro de rede →
      `healthy: false`
- [ ] `src/index.ts`: lê `PORT`, `LB_STRATEGY`, `HEALTH_CHECK_INTERVAL` e
      `BACKENDS` do `.env`, roda `runHealthChecks` a cada intervalo e faz proxy
      das requisições para o backend escolhido (liberando a conexão ao final)

## 🗂️ Estrutura dos Dados

```typescript
interface Backend {
  id: string;
  host: string;
  port: number;
  weight: number;
  healthy: boolean;
  connections: number;
}

interface LoadBalancerConfig {
  strategy: "roundRobin" | "leastConn" | "weighted" | "ipHash";
  /** Intervalo entre health checks, em milissegundos. */
  healthCheckInterval: number;
  backends: Backend[];
}

interface LoadBalancer {
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
```

## 💡 Exemplo de Uso

```typescript
import { createLoadBalancer } from "./loadbalancer.service.ts";

const lb = createLoadBalancer({
  strategy: "leastConn",
  healthCheckInterval: 10_000,
  backends: [
    {
      id: "api-1",
      host: "localhost",
      port: 3001,
      weight: 1,
      healthy: true,
      connections: 0,
    },
    {
      id: "api-2",
      host: "localhost",
      port: 3002,
      weight: 2,
      healthy: true,
      connections: 0,
    },
  ],
});

setInterval(() => lb.runHealthChecks(), 10_000);

const target = lb.getNextBackend("192.168.0.10");
if (target) {
  try {
    await fetch(`http://${target.host}:${target.port}/api/clientes`);
  } finally {
    lb.releaseBackend(target.id);
  }
}
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

Para testar de verdade, suba alguns servidores simples nas portas de `BACKENDS`
(com uma rota `/health`) antes de iniciar o balancer.

## 📚 Conceitos

- [Load balancing (Wikipedia)](https://pt.wikipedia.org/wiki/Balanceamento_de_carga)
- [Weighted round robin (Wikipedia)](https://en.wikipedia.org/wiki/Weighted_round_robin)
- [Consistent hashing (Wikipedia)](https://en.wikipedia.org/wiki/Consistent_hashing)
- [Deno.serve](https://docs.deno.com/api/deno/~/Deno.serve) e
  [ServeHandlerInfo.remoteAddr](https://docs.deno.com/api/deno/~/Deno.ServeHandlerInfo)
- [Fetch API (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)

## 📝 Notas

- `getNextBackend` altera `connections`: sempre chame `releaseBackend` quando a
  requisição terminar
- L4 (TCP) vs L7 (HTTP): aqui você está fazendo L7
- Extra: consistent hashing para o `ipHash` (menos remapeamento quando o pool
  muda) e circuit breaker por backend (veja o desafio 35)
