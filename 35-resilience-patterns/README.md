# Desafio 35: Resilience Patterns

## 🎯 Objetivo

Implementar padrões de resiliência: Circuit Breaker, Bulkhead, Retry e Timeout.

## 📋 Contexto Real

Sistemas distribuídos falham:
- Serviços indisponíveis
- Timeouts de rede
- Sobrecarga de recursos

## 📐 Requisitos

- [ ] Implementar Circuit Breaker
- [ ] Criar Bulkhead para isolar falhas
- [ ] Implementar Retry com backoff
- [ ] Configurar Timeouts
- [ ] Criar Fallback

## 🗂️ Estrutura dos Dados

```typescript
interface CircuitBreakerState {
  status: "closed" | "open" | "half-open";
  failures: number;
  lastFailure?: string;
}

interface BulkheadConfig {
  maxConcurrent: number;
  maxQueue: number;
  timeout: number;
}

interface RetryConfig {
  maxRetries: number;
  backoff: "linear" | "exponential";
  delay: number;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Circuit Breaker previne cascata de falhas
- Bulkhead isola recursos por serviço
- Retry deve ter limite máximo

---

**Dica:** Use Circuit Breaker para chamadas externas, Bulkhead para recursos compartilhados.