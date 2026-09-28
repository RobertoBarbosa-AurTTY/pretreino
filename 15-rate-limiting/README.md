# Desafio 15: Rate Limiting

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar rate limiting em memória (janela fixa) por IP, com limites
diferentes por endpoint e headers padrão de resposta.

## 📋 Contexto Real

APIs públicas limitam quantas requisições um cliente pode fazer por janela de
tempo para se proteger de abuso, brute force no login e picos que derrubam o
serviço. O cliente precisa saber quanto ainda pode chamar (`X-RateLimit-*`) e,
quando bloqueado, quanto esperar (`Retry-After`, status `429`).

O servidor HTTP em `src/index.ts` já está montado; seu trabalho é o
`src/rateLimit.service.ts`.

## 📐 Requisitos

- [ ] `getClientKey(req)` retorna o primeiro IP de `X-Forwarded-For`; sem ele,
      `X-Real-IP`; sem nenhum dos dois, `"unknown"`
- [ ] `checkRateLimit(key, config)` usa **janela fixa**: a primeira requisição
      de uma chave abre a janela (`resetAt = Date.now() + windowMs`)
- [ ] Padrões: `windowMs = 60000` e `maxRequests = 100`
- [ ] Retorna `allowed: true` até a `maxRequests`-ésima requisição da janela; a
      partir da seguinte, `allowed: false`
- [ ] `remaining` = requisições restantes na janela (nunca negativo); `total` =
      `maxRequests`
- [ ] Depois de `resetAt`, a contagem da chave recomeça
- [ ] Chaves diferentes têm contadores independentes
- [ ] `rateLimit(config)` retorna uma função `(req) => RateLimitResponse` que
      usa `getClientKey`; cada limiter criado tem **contagem própria** (o limite
      de login não consome o limite global)
- [ ] Headers retornados: `X-RateLimit-Limit`, `X-RateLimit-Remaining`,
      `X-RateLimit-Reset` (`Math.ceil(resetAt / 1000)`, unix em segundos) e, só
      quando bloqueado, `Retry-After` (segundos até `resetAt`, arredondado para
      cima)
- [ ] `cleanupExpired()` remove as janelas já vencidas e retorna quantas removeu
- [ ] `getStats()` retorna `{ totalKeys, totalRequests }` das janelas ativas
- [ ] `src/index.ts` lê os limites de `GLOBAL_*`, `AUTH_*` e `API_*` no `.env`

## 🗂️ Estrutura dos Dados

```typescript
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  total: number;
}

export interface RateLimitResponse extends RateLimitResult {
  /** X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset and, when blocked, Retry-After */
  headers: Record<string, string>;
}

export type RateLimiter = (req: Request) => RateLimitResponse;
```

### Endpoints do servidor (`src/index.ts`)

| Método | Rota         | Limite padrão |
| ------ | ------------ | ------------- |
| `GET`  | `/health`    | global        |
| `POST` | `/api/login` | 10 req/min    |
| `GET`  | `/api/dados` | 50 req/min    |
| `GET`  | `/api/stats` | global        |

## 💡 Exemplo de Uso

```typescript
import { checkRateLimit, rateLimit } from "./src/rateLimit.service.ts";

checkRateLimit("203.0.113.7", { windowMs: 60_000, maxRequests: 2 });
// { allowed: true, remaining: 1, resetAt: 1735689660000, total: 2 }

const limiter = rateLimit({ windowMs: 60_000, maxRequests: 10 });
const result = limiter(req);
if (!result.allowed) {
  return new Response("Too many requests", {
    status: 429,
    headers: result.headers,
  });
}
```

```bash
curl -i http://localhost:3003/api/dados
# X-RateLimit-Limit: 50
# X-RateLimit-Remaining: 49
# X-RateLimit-Reset: 1735689660
```

## ⚙️ Setup

```bash
cd 15-rate-limiting
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [HTTP 429 Too Many Requests](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/429)
- [Header Retry-After](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers/Retry-After)
- [X-Forwarded-For](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers/X-Forwarded-For)
- [Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Closures](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Closures)

## 📝 Notas

- `X-Forwarded-For` pode ser forjado pelo cliente; em produção só confie nele
  atrás de um proxy conhecido.
- Extra: janela deslizante ou token bucket, storage em Redis, limpeza periódica
  com `setInterval`.
