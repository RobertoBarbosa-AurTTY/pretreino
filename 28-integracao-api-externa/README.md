# Desafio 28: Integração com API Externa

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar um cliente HTTP robusto para uma API externa (a mock API hospedada),
com autenticação, timeout, retry, rate limiting local, circuit breaker, cache de
respostas e fallback.

## 📋 Contexto Real

Sistemas modernos dependem de APIs externas que ficam lentas, caem ou limitam
requisições:

- Gateways de pagamento
- Serviços de email
- APIs de geolocalização
- ERPs e CRMs de parceiros

Um cliente bem feito protege a sua aplicação dessas falhas.

## 📐 Requisitos

Arquivo: `src/api-client.service.ts`. Tudo é feito por meio do objeto retornado
por `createClient(config)`.

- [ ] `login()` faz `POST {baseUrl}/api/auth/login` com `{ email, password }` e
      retorna o `token`; rejeita se a resposta não for 2xx
- [ ] `request()` envia `Authorization: Bearer <token>`: usa `config.token` se
      existir, senão faz `login()` na primeira requisição e reaproveita o token
- [ ] Ao receber `401`, faz login novamente **uma vez** e repete a requisição
- [ ] Corpo (`data`) é enviado como JSON com `Content-Type: application/json`;
      `idempotencyKey` vira o header `Idempotency-Key`
- [ ] Resposta 2xx → `{ success: true, data, metadata }`, com
      `metadata.requestId` único, `timestamp` (ISO 8601) e `latency` (ms)
- [ ] Cada tentativa é abortada após `timeout` ms (`AbortController`) → erro
      `TIMEOUT`
- [ ] Erros `5xx`, timeout e falha de rede são repetidos até `retries` vezes
      (total de `1 + retries` chamadas), aguardando `retryDelay` ms (extra:
      backoff exponencial)
- [ ] Erros `4xx` (exceto `401`) **não** são repetidos
- [ ] Falha final → `{ success: false, error: { code, message } }` com `code` =
      `HTTP_<status>` (ex.: `HTTP_500`), `TIMEOUT` ou `NETWORK_ERROR`
- [ ] `rateLimit`: no máximo `maxRequests` por `windowMs`; acima disso retorna
      erro `RATE_LIMITED` sem chamar a API; `getRateLimitState()` informa
      `remaining`, `reset` e `limited`
- [ ] `circuitBreaker`: após `failureThreshold` requisições com falha seguidas,
      o estado vira `"open"` e as requisições falham na hora com `CIRCUIT_OPEN`
      (sem chamar a API)
- [ ] Depois de `resetTimeoutMs`, o estado vira `"half-open"`; a próxima
      requisição é um teste: sucesso → `"closed"` (zera `failures`), falha →
      `"open"` de novo
- [ ] `cacheTtlMs`: respostas `GET` com sucesso ficam em cache por esse tempo
      (mesmo `path` não chama a API de novo); `clearCache()` esvazia o cache
- [ ] `configureFallback(path, fn)`: quando a requisição para `path` falha
      (incluindo `CIRCUIT_OPEN`), retorna `{ success: true, data: await fn() }`

## 🗂️ Estrutura dos Dados

```typescript
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  /** Credentials used on POST /api/auth/login (mock API) */
  email?: string;
  password?: string;
  /** Pre-obtained token (skips login) */
  token?: string;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  circuitBreaker?: {
    failureThreshold: number;
    resetTimeoutMs: number;
  };
  /** How long GET responses stay cached (default: no cache) */
  cacheTtlMs?: number;
}

export interface ApiRequest<T> {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  data?: T;
  headers?: Record<string, string>;
  idempotencyKey?: string;
}

export interface ApiResponse<T> {
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

export interface CircuitBreakerState {
  status: "closed" | "open" | "half-open";
  failures: number;
  lastFailure?: string;
  nextAttempt?: string;
}

export interface RateLimitState {
  remaining: number;
  reset: number;
  limited: boolean;
}

export interface ApiClient {
  /** Authenticate (POST /api/auth/login) and return the token */
  login(): Promise<string>;
  request<TRequest, TResponse>(
    request: ApiRequest<TRequest>,
  ): Promise<ApiResponse<TResponse>>;
  getCircuitBreakerState(): CircuitBreakerState;
  getRateLimitState(): RateLimitState;
  /** Register a fallback used when requests to `path` fail */
  configureFallback<T>(path: string, fallback: () => Promise<T>): void;
  clearCache(): void;
}
```

## 🔌 API

Usa a mock API hospedada em `https://api-mock-98te.onrender.com` (documentação
completa em [`../API.md`](../API.md)).

| Método | Rota                    | Uso no desafio                                                  |
| ------ | ----------------------- | --------------------------------------------------------------- |
| `POST` | `/api/auth/login`       | Obter o token (`joao@email.com` / `123456`)                     |
| `GET`  | `/api/produtos`         | Requisição GET (bom para testar cache)                          |
| `GET`  | `/api/clientes`         | Outra requisição GET                                            |
| `POST` | `/api/emails?fail=true` | Força falha, útil para testar retry, circuit breaker e fallback |

Todas as rotas (exceto login e `/health`) exigem
`Authorization: Bearer <token>`; sem token a API responde `401`. A primeira
requisição pode levar 30–60 s (plano gratuito do Render "acordando"), então use
um `API_TIMEOUT` generoso ao rodar o `dev`.

## 💡 Exemplo de Uso

```typescript
import { createClient } from "./src/api-client.service.ts";

const client = createClient({
  baseUrl: "https://api-mock-98te.onrender.com",
  email: "joao@email.com",
  password: "123456",
  timeout: 5000,
  retries: 3,
  retryDelay: 1000,
  rateLimit: { maxRequests: 100, windowMs: 60_000 },
  circuitBreaker: { failureThreshold: 5, resetTimeoutMs: 30_000 },
  cacheTtlMs: 60_000,
});

client.configureFallback("/api/produtos", async () => []);

const products = await client.request({ method: "GET", path: "/api/produtos" });

const email = await client.request({
  method: "POST",
  path: "/api/emails?fail=true",
  data: {
    to: "cliente@email.com",
    subject: "Pedido",
    template: "order",
    data: {},
  },
  idempotencyKey: "pedido-123",
});
if (!email.success) console.error(email.error); // { code: "HTTP_500", ... }

console.log(client.getCircuitBreakerState());
```

## ⚙️ Setup

```bash
cd 28-integracao-api-externa
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Fetch API — MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [AbortSignal.timeout — MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)
- [Circuit Breaker — Microsoft](https://learn.microsoft.com/pt-br/azure/architecture/patterns/circuit-breaker)
- [Retry com backoff exponencial — AWS](https://aws.amazon.com/pt/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Idempotency-Key — IETF draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/)

## 📝 Notas

- Sempre use timeout: sem ele, uma API travada trava a sua aplicação.
- Uma requisição com falha conta **uma** vez para o circuit breaker, mesmo que
  tenha feito várias tentativas.
- Adicione jitter ao backoff para evitar que vários clientes tentem ao mesmo
  tempo.
- Registre (log) cada tentativa com o `requestId` para facilitar o
  troubleshooting.
