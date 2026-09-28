# Desafio 27: Logging e Monitoramento

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar logging estruturado em JSON com níveis, coleta de métricas, tracing
com spans e alertas automáticos baseados em métricas.

## 📋 Contexto Real

Aplicações em produção precisam de observabilidade:

- Rastreamento de erros com contexto (requestId, userId)
- Monitoramento de performance (latência, throughput)
- Tracing para seguir uma requisição entre serviços
- Alertas proativos antes que o usuário perceba o problema

## 📐 Requisitos

Arquivo: `src/monitoring.service.ts`.

- [ ] `registerLog(entry)` adiciona `timestamp` (ISO 8601) e escreve a entrada
      como **uma linha JSON** (`JSON.stringify`)
- [ ] Destino por nível: `debug`/`info` → `console.log`, `warn` →
      `console.warn`, `error`/`fatal` → `console.error`
- [ ] `createLogger(service, level = "info")` retorna um `Logger` com `debug`,
      `info`, `warn`, `error` e `fatal`
- [ ] O logger inclui `service` em `context` e mescla o contexto recebido
- [ ] O logger ignora mensagens abaixo do nível mínimo (ordem:
      `debug < info < warn < error < fatal`)
- [ ] Se o contexto tiver `error` (um `Error` ou `{ name, message }`), ele vai
      para o campo `error` da entrada (`name`, `message`, `stack`) e sai de
      `context`
- [ ] `createMetric(name, value, tags = {})` registra a métrica com `timestamp`;
      `getMetrics(name?)` lista as métricas em ordem de registro, filtrando por
      nome
- [ ] `startTracing(operation, traceId?, parentSpanId?)` cria um span com
      `spanId` novo, `traceId` novo (ou o informado), `startTime` e
      `attributes: {}`
- [ ] `finishSpan(span, status)` define `status` e `endTime` (ISO 8601) no span
- [ ] `configureAlerts(rules, onAlert?)` substitui as regras; a cada
      `createMetric`, cada regra daquela métrica compara a **média dos valores
      registrados nos últimos `window` segundos** com `threshold` usando
      `condition` (`gt`, `lt`, `eq`)
- [ ] Quando a condição é verdadeira, `onAlert(rule, metric)` é chamado; com
      `action: "log"` também é registrado um log `warn`
- [ ] `src/index.ts`: usar `LOG_LEVEL`, `SERVICE_NAME` e `ENABLE_TRACING` do
      ambiente

## 🗂️ Estrutura dos Dados

```typescript
export interface LogEntry {
  level: "debug" | "info" | "warn" | "error" | "fatal";
  message: string;
  timestamp: string;
  context: {
    requestId?: string;
    userId?: string;
    action?: string;
    [key: string]: unknown;
  };
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface Metric {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: string;
}

export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operation: string;
  startTime: string;
  endTime: string;
  status: "ok" | "error";
  attributes: Record<string, unknown>;
}

export interface AlertRule {
  metric: string;
  condition: "gt" | "lt" | "eq";
  threshold: number;
  window: number;
  action: "log" | "webhook" | "email";
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  fatal(message: string, context?: Record<string, unknown>): void;
}
```

## 💡 Exemplo de Uso

```typescript
import {
  configureAlerts,
  createLogger,
  createMetric,
  finishSpan,
  startTracing,
} from "./src/monitoring.service.ts";

const logger = createLogger("api-pedidos", "info");
logger.info("Pedido criado", { requestId: "abc123", orderId: "ped789" });
// {"level":"info","message":"Pedido criado","timestamp":"...","context":{"service":"api-pedidos",...}}

configureAlerts(
  [{
    metric: "orders.latency_ms",
    condition: "gt",
    threshold: 1000,
    window: 60,
    action: "log",
  }],
  (rule, metric) => console.log(`Alerta: ${rule.metric} = ${metric.value}`),
);

const span = startTracing("process_order");
try {
  // ... processa o pedido
  createMetric("orders.latency_ms", 1250, { status: "success" });
  finishSpan(span, "ok");
} catch (error) {
  logger.error("Erro ao processar pedido", { requestId: "abc123", error });
  finishSpan(span, "error");
}
```

## ⚙️ Setup

```bash
cd 27-logging-monitoramento
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [JSON.stringify — MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [console — MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/console)
- [OpenTelemetry: traces e spans](https://opentelemetry.io/docs/concepts/signals/traces/)
- [OpenTelemetry no Deno](https://docs.deno.com/runtime/fundamentals/open_telemetry/)

## 📝 Notas

- Sempre inclua `requestId` nos logs para correlacionar requisições.
- `traceId` e `spanId` podem ser gerados com `crypto.randomUUID()`.
- `webhook` e `email` como `action` de alerta são extras.
- Em produção, considere sampling de traces e rotação de logs.
