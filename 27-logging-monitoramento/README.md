# Desafio 27: Logging e Monitoramento

## 🎯 Objetivo

Implementar um sistema de logging estruturado e monitoramento de aplicações backend.

## 📋 Contexto Real

Aplicações em produção precisam de observabilidade:
- Rastreamento de erros
- Monitoramento de performance
- Alertas proativos
- Análise de comportamento

## 📐 Requisitos

- [ ] Implementar logging estruturado (JSON)
- [ ] Criar diferentes níveis de log
- [ ] Implementar tracing distribuído
- [ ] Criar métricas de performance
- [ ] Configurar alertas automáticos
- [ ] Integrar com ferramentas de observabilidade

## 🗂️ Estrutura dos Dados

```typescript
interface LogEntry {
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

interface Metric {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: string;
}

interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operation: string;
  startTime: string;
  endTime: string;
  status: "ok" | "error";
  attributes: Record<string, unknown>;
}

interface AlertRule {
  metric: string;
  condition: "gt" | "lt" | "eq";
  threshold: number;
  window: number; // em segundos
  action: "log" | "webhook" | "email";
}
```

## 💡 Exemplo de Uso

```typescript
// Logger estruturado
const logger = new Logger({ service: "api-pedidos" });

logger.info("Pedido criado", {
  requestId: "abc123",
  userId: "user456",
  pedidoId: "ped789",
  valor: 150.00
});

logger.error("Erro ao processar pagamento", {
  requestId: "abc123",
  error: { name: "PaymentError", message: "Cartão recusado" }
});

// Métricas
const metrics = new MetricsCollector();
metrics.increment("pedidos.criados", { status: "sucesso" });
metrics.histogram("pedidos.tempo_processamento", 1250);

// Tracing
const tracer = new Tracer("api-pedidos");
const span = tracer.startSpan("processar_pedido");
try {
  await processarPedido(pedido);
  span.setStatus("ok");
} catch (error) {
  span.setStatus("error");
  span.setAttribute("error.message", error.message);
} finally {
  span.end();
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 🧪 Testes

```bash
deno task test
```

## 📝 Notas

- Use Winston ou Pino para logging
- Implemente structured logging em JSON
- Use OpenTelemetry para tracing
- Considere sampling para traces
- Implemente log rotation

---

**Dica:** Sempre inclua requestId nos logs para correlacionar requisições em sistemas distribuídos.