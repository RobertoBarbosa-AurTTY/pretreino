# Desafio 28: Integração com API Externa

## 🎯 Objetivo

Implementar uma integração robusta com API externa tratando rate limiting, retry e fallback.

## 📋 Contexto Real

Sistemas modernos dependem de APIs externas:
- Gateway de pagamento
- Serviços de email
- APIs de geolocalização
- Serviços de pagamento

## 📐 Requisitos

- [ ] Criar cliente HTTP para API externa
- [ ] Implementar retry com backoff exponencial
- [ ] Tratar rate limiting da API
- [ ] Implementar circuit breaker
- [ ] Criar cache de respostas
- [ ] Implementar fallback em caso de falha

## 🗂️ Estrutura dos Dados

```typescript
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

interface ApiRequest<T> {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  data?: T;
  headers?: Record<string, string>;
  idempotencyKey?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    latency: number;
  };
}

interface CircuitBreakerState {
  status: "closed" | "open" | "half-open";
  failures: number;
  lastFailure?: string;
  nextAttempt?: string;
}

interface RateLimitState {
  remaining: number;
  reset: number;
  limited: boolean;
}
```

## 💡 Exemplo de Uso

```typescript
// Configurar cliente
const apiClient = new ApiClient({
  baseUrl: "https://api.pagamento.com",
  timeout: 5000,
  retries: 3,
  retryDelay: 1000,
  rateLimit: { maxRequests: 100, windowMs: 60000 }
});

// Fazer requisição com tratamento
const resultado = await apiClient.request({
  method: "POST",
  path: "/cobrar",
  data: { valor: 150.00, metodo: "cartao" },
  idempotencyKey: "pedido-123"
});

if (resultado.success) {
  console.log("Pagamento processado:", resultado.data);
} else {
  console.error("Erro:", resultado.error);
}

// Verificar estado do circuit breaker
const state = apiClient.getCircuitBreakerState();
if (state.status === "open") {
  console.log("API indisponível, usando fallback");
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

- Use axios ou fetch nativo
- Implemente idempotency keys para POST
- Cacheie respostas GET quando possível
- Implemente logging de todas as requisições
- Considere mock para testes

---

**Dica:** Sempre implemente timeout nas requisições para evitar que a aplicação fique travada aguardando resposta.