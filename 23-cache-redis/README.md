# Desafio 23: Cache com Redis

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar uma camada de cache sobre Redis (TTL, cache-aside, invalidação por
chave e por padrão, estatísticas de hit/miss) para reduzir latência e carga no
banco de dados.

## 📋 Contexto Real

Aplicações de alta performance dependem de cache:

- Reduzir latência de consultas frequentes
- Diminuir carga no banco de dados
- Guardar sessões de usuário
- Suportar rate limiting distribuído

## 📐 Requisitos

Arquivo: `src/cache.service.ts`. O serviço conversa com o armazenamento sempre
pela interface `CacheStore`: em produção, `connectRedis(url)` cria um adaptador
Redis que a implementa; para rodar sem Redis, `useStore(store)` injeta um store
em memória.

- [ ] `configureCache({ prefix, ttl })` define o prefixo das chaves e o TTL
      padrão (segundos)
- [ ] `useStore(store)` passa a usar o store informado e zera as estatísticas
- [ ] `connectRedis(url)` conecta ao Redis e usa um `CacheStore` baseado nele;
      `disconnectRedis()` fecha a conexão
- [ ] Toda chave gravada no store recebe o prefixo: `setCache("user:1", ...)`
      com prefixo `app:` grava `app:user:1`
- [ ] `setCache(key, value, ttl?)` grava `JSON.stringify(value)` usando o `ttl`
      informado ou o TTL padrão
- [ ] `getCache(key)` retorna `{ hit: true, data, fromCache: true }` com o valor
      desserializado, ou `{ hit: false, data: null, fromCache: false }`
- [ ] `getOrSet(key, loader, ttl?)` implementa cache-aside: em miss chama
      `loader`, grava o resultado e o retorna; em hit **não** chama `loader`
- [ ] `invalidateCache(key)` remove a chave e retorna `true` se ela existia,
      senão `false`
- [ ] `invalidateCacheByPattern(pattern)` remove as chaves que casam com
      `prefixo + pattern` (ex.: `user:*`) e retorna quantas removeu
- [ ] `getCacheStats()` retorna `hits`, `misses` (contados em
      `getCache`/`getOrSet`), `hitRate = hits / (hits + misses)` (0 se não houve
      consultas) e `keysCount` (chaves com o prefixo)
- [ ] Extra: se o Redis cair, a aplicação continua funcionando (fallback: trata
      como miss e chama o loader)

## 🗂️ Estrutura dos Dados

```typescript
export interface CacheConfig {
  prefix: string;
  ttl: number;
  serialize?: boolean;
}

export interface CacheResult<T> {
  hit: boolean;
  data: T | null;
  fromCache: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  keysCount: number;
}

export interface CacheStore {
  get(key: string): Promise<string | null>;
  /** ttl in seconds */
  set(key: string, value: string, ttl: number): Promise<void>;
  /** returns how many keys were removed */
  del(...keys: string[]): Promise<number>;
  /** glob pattern, e.g. "app:user:*" */
  keys(pattern: string): Promise<string[]>;
}
```

## 💡 Exemplo de Uso

```typescript
import {
  configureCache,
  connectRedis,
  getCacheStats,
  getOrSet,
  invalidateCache,
  invalidateCacheByPattern,
} from "./src/cache.service.ts";

configureCache({ prefix: "app:", ttl: 3600 });
await connectRedis("redis://localhost:6379");

const user = await getOrSet("user:123", () => findUserInDatabase("123"));

await invalidateCache("user:123"); // usuário foi atualizado
await invalidateCacheByPattern("user:*"); // limpa todos os usuários

console.log(await getCacheStats()); // { hits, misses, hitRate, keysCount }
```

## ⚙️ Setup

Você precisa de um Redis rodando localmente para `deno task dev`:

```bash
docker run -d --name redis -p 6379:6379 redis:7
```

```bash
cd 23-cache-redis
cp .env.example .env
deno task dev
```

Para o cliente Redis, adicione uma dependência no `deno.json` do desafio, por
exemplo `"imports": { "redis": "npm:redis@^4" }`.

## 📚 Conceitos

- [Redis: EXPIRE / TTL](https://redis.io/docs/latest/commands/expire/)
- [Redis: KEYS e SCAN](https://redis.io/docs/latest/commands/scan/)
- [Padrão Cache-Aside — Microsoft](https://learn.microsoft.com/pt-br/azure/architecture/patterns/cache-aside)
- [JSON.stringify — MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [npm packages no Deno](https://docs.deno.com/runtime/fundamentals/node/#using-npm-packages)

## 📝 Notas

- Em produção prefira `SCAN` a `KEYS` para padrões (KEYS bloqueia o Redis).
- TTL variável (±10% aleatório) evita "thundering herd" quando muitas chaves
  expiram juntas.
- `serialize: false` pode ser usado para gravar strings sem `JSON.stringify`
  (extra).
- Considere um circuit breaker para não sobrecarregar um Redis instável.
