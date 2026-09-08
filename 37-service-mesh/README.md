# Desafio 37: Service Mesh

## 🎯 Objetivo

Implementar conceitos de Service Mesh para comunicação entre microserviços.

## 📋 Contexto Real

Comunicação复杂a entre serviços:
- Observabilidade de tráfego
- Segurança mTLS
- Load balancing avançado
- Circuit breaking distribuído

## 📐 Requisitos

- [ ] Criar sidecar proxy
- [ ] Implementar service discovery
- [ ] Configurar mTLS
- [ ] Criar métricas de tráfego
- [ ] Implementar load balancing

## 🗂️ Estrutura dos Dados

```typescript
interface ServiceInstance {
  id: string;
  host: string;
  port: number;
  metadata: Record<string, string>;
}

interface TrafficPolicy {
  loadBalancer: "roundRobin" | "leastConn" | "random";
  timeout: number;
  retries: number;
}

interface MeshConfig {
  services: ServiceInstance[];
  policy: TrafficPolicy;
  mtls: boolean;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Service Mesh abstrai comunicação de rede
- Sidecar proxy intercepta todo tráfego
- Considere Istio ou Linkerd como referência

---

**Dica:** Para poucos serviços, complexities pode não valer a pena.