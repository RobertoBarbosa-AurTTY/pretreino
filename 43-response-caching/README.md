# Desafio 43: Response Caching

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar um cache de respostas HTTP em memória com TTL, limite de tamanho,
estratégias de remoção (LRU, LFU, FIFO) e revalidação condicional via ETag.

## 📋 Contexto Real

Endpoints de leitura muito acessados (catálogo de produtos, listas de clientes)
repetem o mesmo trabalho a cada requisição. Um cache de respostas:

- Reduz latência e carga no banco
- Precisa expirar dados (TTL) e caber na memória (tamanho máximo)
- Com ETag, evita reenviar o body quando o cliente já tem a versão atual (`304`)

## 📐 Requisitos

- [ ] `createCache(config)` retorna um `ResponseCache`; `config.ttl` está em
      **milissegundos**
- [ ] `set(key, response, headers?)` grava uma `CacheEntry` com `createdAt` =
      agora e `expiresAt` = agora + `ttl` (ISO 8601); `headers` padrão é `{}`
- [ ] `get(key)` retorna a entrada ou `null` se não existir ou estiver expirada
      (depois de `expiresAt`)
- [ ] `stats()` retorna `{ hits, misses }`: cada `get` que encontra entrada
      válida é hit; os demais (inclusive expirados) são miss
- [ ] `invalidate(key)` remove uma chave; `clear()` remove todas
- [ ] Ao inserir uma nova chave com o cache cheio (`maxSize`), remove uma
      entrada conforme `strategy`: `"lru"` (usada há mais tempo), `"fifo"`
      (inserida primeiro) ou `"lfu"` (menos `get`s; empate → a mais antiga)
- [ ] `generateCacheKey(req)` gera `MÉTODO + URL`, com os query params em ordem
      alfabética (`?b=2&a=1` e `?a=1&b=2` geram a mesma chave)
- [ ] `generateETag(body)` retorna um ETag forte entre aspas (ex:
      `"5d41402a..."`), igual para o mesmo body e diferente para bodies
      diferentes
- [ ] `isNotModified(req, etag)` retorna `true` somente se o header
      `If-None-Match` da requisição for igual a `etag`
- [ ] `src/index.ts`: servidor na porta `PORT` que cacheia respostas `GET` (TTL
      `CACHE_TTL_MS`, tamanho `CACHE_MAX_SIZE`), envia `ETag` e responde `304`
      quando `isNotModified`

## 🗂️ Estrutura dos Dados

```typescript
interface CacheEntry {
  key: string;
  response: unknown;
  headers: Record<string, string>;
  createdAt: string;
  expiresAt: string;
}

interface CacheConfig {
  /** Tempo de vida de cada entrada, em milissegundos. */
  ttl: number;
  /** Número máximo de entradas no cache. */
  maxSize: number;
  strategy: "lru" | "lfu" | "fifo";
}

interface ResponseCache {
  get(key: string): CacheEntry | null;
  set(key: string, response: unknown, headers?: Record<string, string>): void;
  invalidate(key: string): void;
  clear(): void;
  stats(): { hits: number; misses: number };
}
```

## 💡 Exemplo de Uso

```typescript
import {
  createCache,
  generateCacheKey,
  generateETag,
  isNotModified,
} from "./cache.service.ts";

const cache = createCache({ ttl: 60_000, maxSize: 1000, strategy: "lru" });

const key = generateCacheKey(req);
const hit = cache.get(key);
if (!hit) {
  cache.set(key, await loadProducts(), { "content-type": "application/json" });
}

const etag = await generateETag(JSON.stringify(cache.get(key)?.response));
if (isNotModified(req, etag)) return new Response(null, { status: 304 });

console.log(cache.stats()); // { hits: 10, misses: 2 }
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [HTTP caching (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Caching)
- [ETag (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers/ETag)
- [Map (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
  — mantém ordem de inserção, útil para LRU/FIFO
- [SubtleCrypto.digest (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)

## 📝 Notas

- Use `Cache-Control` para indicar ao cliente por quanto tempo reutilizar a
  resposta
- A chave do cache deve considerar a URL completa, incluindo query params
- Extra: invalidar por prefixo (ex: tudo em `/api/produtos` após um `POST`)
- Extra: cache distribuído (Redis — veja o desafio 23)
