# Desafio 50: Load Balancer

## 🎯 Objetivo

Implementar load balancer com múltiplas estratégias de distribuição.

## 📋 Contexto Real

Alta disponibilidade:
- Distribuição de carga
- Failover automático
- Escalabilidade horizontal

## 📐 Requisitos

- [ ] Implementar Round Robin
- [ ] Implementar Least Connections
- [ ] Implementar Weighted Round Robin
- [ ] Health checks dos backends
- [ ] Sticky sessions

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
  healthCheckInterval: number;
  backends: Backend[];
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Considere L4 vs L7 load balancing
- Implemente circuit breaker nos backends
- Monitore métricas de cada backend

---

**Dica:** Use consistent hashing para sticky sessions.