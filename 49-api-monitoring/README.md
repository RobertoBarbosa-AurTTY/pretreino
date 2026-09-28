# Desafio 49: API Monitoring

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar um serviço de monitoramento de API que coleta métricas por
requisição, calcula taxa de erros e percentis de latência em janelas de tempo,
dispara alertas e reporta a saúde do sistema.

## 📋 Contexto Real

"A API está lenta?" e "quantos erros tivemos nos últimos 5 minutos?" são
perguntas que o time de plantão faz o tempo todo. Um monitoramento útil:

- Registra latência e status de cada requisição por endpoint
- Olha para **janelas de tempo** recentes, não para a média de todo o histórico
- Usa **percentis** (p99), porque a média esconde os usuários mais afetados
- Dispara alertas objetivos e resume a saúde em `healthy`/`degraded`/`down`

## 📐 Requisitos

- [ ] `percentile(values, p)` usa **nearest-rank**: ordena, pega o elemento de
      posição `ceil(p/100 * n)` (mínimo 1); lista vazia → `0`
- [ ] `recordMetric(metric)` armazena a métrica
- [ ] `getMetrics(endpoint, window)` retorna as métricas daquele endpoint com
      `timestamp >= agora - window` (ms), na ordem em que foram registradas
- [ ] Um **erro** é uma métrica com `statusCode >= 500` (4xx não conta)
- [ ] `addAlert(rule)` registra uma regra; cada regra avalia as métricas de
      **todos** os endpoints dentro de `rule.window` ms:
  - `"error_rate"`: dispara se `erros / total > threshold` (threshold de 0 a 1)
  - `"latency_p99"`: dispara se o p99 das latências `> threshold` (ms)
  - `"uptime"`: dispara se `(total - erros) / total < threshold`
  - Sem métricas na janela, a regra **não** dispara
- [ ] `getTriggeredAlerts()` retorna as regras disparadas agora, na ordem em que
      foram adicionadas
- [ ] `checkHealth()` retorna `checks` com uma entrada por regra (`nome → true`
      se **não** disparou) e `status`: `"healthy"` se nenhuma disparou (ou não
      há regras), `"down"` se todas dispararam, senão `"degraded"`
- [ ] `src/index.ts`: servidor na porta `PORT` que mede cada requisição com
      `recordMetric` e expõe `GET /health` com o resultado de `checkHealth()`

## 🗂️ Estrutura dos Dados

```typescript
interface ApiMetric {
  endpoint: string;
  method: string;
  statusCode: number;
  /** Latência em milissegundos. */
  latency: number;
  timestamp: string;
}

interface AlertRule {
  name: string;
  condition: "error_rate" | "latency_p99" | "uptime";
  threshold: number;
  /** Janela de tempo avaliada, em milissegundos. */
  window: number;
}

interface HealthStatus {
  status: "healthy" | "degraded" | "down";
  checks: Record<string, boolean>;
}

interface MonitoringService {
  recordMetric(metric: ApiMetric): void;
  getMetrics(endpoint: string, window: number): ApiMetric[];
  checkHealth(): HealthStatus;
  addAlert(rule: AlertRule): void;
  getTriggeredAlerts(): AlertRule[];
}
```

## 💡 Exemplo de Uso

```typescript
import { createService, percentile } from "./monitoring.service.ts";

const monitor = createService();
monitor.addAlert({
  name: "erros-5xx",
  condition: "error_rate",
  threshold: 0.05,
  window: 60_000,
});
monitor.addAlert({
  name: "p99-lento",
  condition: "latency_p99",
  threshold: 800,
  window: 300_000,
});

const start = performance.now();
// ... atende a requisição ...
monitor.recordMetric({
  endpoint: "/api/clientes",
  method: "GET",
  statusCode: 200,
  latency: performance.now() - start,
  timestamp: new Date().toISOString(),
});

const latencies = monitor.getMetrics("/api/clientes", 60_000).map((m) =>
  m.latency
);
console.log("p95:", percentile(latencies, 95));
console.log(monitor.checkHealth()); // { status: "healthy", checks: { "erros-5xx": true, "p99-lento": true } }
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Percentil — nearest-rank (Wikipedia)](https://en.wikipedia.org/wiki/Percentile#The_nearest-rank_method)
- [performance.now (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Performance/now)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Deno.serve](https://docs.deno.com/api/deno/~/Deno.serve)

## 📝 Notas

- Monitore o que importa: os "quatro sinais de ouro" (latência, tráfego, erros,
  saturação)
- Descarte métricas antigas para a memória não crescer para sempre
- Extra: expor as métricas no formato Prometheus (`GET /metrics`) e um dashboard
  em tempo real
- Extra: enviar as métricas para `POST /api/metricas` da [mock API](../API.md)
