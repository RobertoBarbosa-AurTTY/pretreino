# Desafio 19: Middleware Chain

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar um sistema de middlewares encadeados no estilo Koa/Oak ("modelo
cebola"): `compose`, um contexto compartilhado e middlewares reutilizáveis de
log, request id, tempo de resposta, CORS, body parser, autenticação e
autorização por papel.

## 📋 Contexto Real

Frameworks como Oak, Hono, Koa e Express organizam as preocupações transversais
(log, CORS, auth, métricas) em middlewares. Cada um pode agir **antes** e
**depois** do handler, ou interromper a cadeia (ex: 401). Entender o `compose`
por dentro ajuda a depurar ordem de execução e a escrever middlewares próprios.

O servidor em `src/index.ts` já monta as cadeias pública e protegida; seu
trabalho é o `src/middleware.ts`.

## 📐 Requisitos

- [ ] `createContext(req)` retorna `{ req, res: undefined, state: {} }` com
      `set(key, value)` / `get(key)` lendo e escrevendo em `state`
- [ ] `compose(...middlewares)` retorna um `Middleware` que executa na ordem
      recebida e, depois do último, chama o `next` final; o código após
      `await next()` roda na ordem inversa (cebola)
- [ ] Se um middleware não chamar `next`, os seguintes e o handler final não
      rodam
- [ ] Chamar `next()` duas vezes no mesmo middleware rejeita com erro
- [ ] `compose()` sem middlewares só chama o `next` final
- [ ] `requestId`: usa o header `X-Request-Id` recebido ou gera um novo
      (`crypto.randomUUID()`), guarda em `state.requestId` e devolve o header
      `X-Request-Id` na resposta
- [ ] `timing`: adiciona `X-Process-Time: <n>ms` na resposta
- [ ] `logger`: após o handler, faz um `console.log` com método, caminho, status
      e duração
- [ ] `cors`: adiciona `Access-Control-Allow-Origin: *`; em `OPTIONS` responde
      `204` com `Access-Control-Allow-Methods`/`-Headers` **sem** chamar `next`
- [ ] `bodyParser`: com `Content-Type: application/json`, guarda o JSON em
      `state.body`; JSON inválido → `400` sem chamar `next`
- [ ] `authMiddleware(token)`: `Authorization: Bearer <token>` correto chama
      `next`; ausente/errado → `401` sem chamar `next`
- [ ] `roleMiddleware(...roles)`: chama `next` se `state.role` está em `roles`;
      senão → `403`
- [ ] `src/index.ts` usa `AUTH_TOKEN` do `.env` para `/api/protected`

## 🗂️ Estrutura dos Dados

```typescript
export interface Context {
  req: Request;
  res?: Response;
  state: Record<string, any>;
  set: (key: string, value: any) => void;
  get: (key: string) => any;
}

export type Next = () => Promise<void>;
export type Middleware = (ctx: Context, next: Next) => Promise<void>;
```

### Endpoints do servidor (`src/index.ts`)

| Método | Rota             | Middlewares                               |
| ------ | ---------------- | ----------------------------------------- |
| `GET`  | `/api/dados`     | logger, requestId, timing, cors           |
| `GET`  | `/api/protected` | logger, requestId, timing, cors, **auth** |
| `GET`  | `/health`        | logger, requestId, timing, cors           |

## 💡 Exemplo de Uso

```typescript
import {
  compose,
  createContext,
  type Middleware,
  requestId,
  timing,
} from "./src/middleware.ts";

const hello: Middleware = async (ctx, next) => {
  console.log("antes");
  await next();
  console.log("depois", ctx.res?.status);
};

const ctx = createContext(new Request("http://localhost/"));
await compose(hello, requestId, timing)(ctx, async () => {
  ctx.res = new Response("ok");
});
ctx.res?.headers.get("X-Request-Id"); // "3f1c..."
```

```bash
curl -i http://localhost:3007/api/dados
# X-Request-Id: 3f1c...
# X-Process-Time: 2ms

curl -i http://localhost:3007/api/protected \
  -H "Authorization: Bearer meu_token_secreto"
```

## ⚙️ Setup

```bash
cd 19-middleware-chain
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Koa: cascading (modelo cebola)](https://koajs.com/#cascading)
- [Oak: middleware](https://jsr.io/@oak/oak)
- [Headers](https://developer.mozilla.org/pt-BR/docs/Web/API/Headers)
- [CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS)
- [performance.now](https://developer.mozilla.org/pt-BR/docs/Web/API/Performance/now)

## 📝 Notas

- Headers de uma `Response` criada com `new Response()` podem ser alterados com
  `ctx.res.headers.set(...)` depois do `await next()`.
- Extra: middleware de cache, rate limiting (reuse o desafio 15) e validação
  automática do body (reuse o desafio 17).
