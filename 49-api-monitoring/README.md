# Desafio 49: API Monitoring

## 🎯 Objetivo

Implementar sistema de monitoramento de APIs com métricas e alertas.

## 📋 Contexto Real

Observabilidade de APIs:
- Uptime e disponibilidade
- Performance
- Erros

## 📐 Requisitos

- [ ] Coletar métricas de latência
- [ ] Monitorar taxa de erros
- [ ] Rastrear endpoints
- [ ] Criar alertas
- [ ] Dashboard em tempo real

## 🗂️ Estrutura dos Dados

```typescript
interface ApiMetric {
  endpoint: string;
  method: string;
  statusCode: number;
  latency: number;
  timestamp: string;
}

interface AlertRule {
  name: string;
  condition: "error_rate" | "latency_p99" | "uptime";
  threshold: number;
  window: number;
}

interface HealthStatus {
  status: "healthy" | "degraded" | "down";
  checks: Record<string, boolean>;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Use Prometheus ou equivalente
- Implemente health checks
- Considere distributed tracing

---

**Dica:** Monitore o que importa - não tudo.