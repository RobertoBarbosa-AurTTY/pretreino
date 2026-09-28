# Desafio 08: Cache de API Externa

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Criar um cache genérico em memória, com TTL, limite de entradas e estatísticas,
para evitar chamadas repetidas a uma API externa.

## 📋 Contexto Real

O sistema consome uma API externa que:

- Cobra por chamada
- Tem limite de requisições
- Retorna dados que raramente mudam

Solução: guardar as respostas em cache por um tempo (TTL).

## 📐 Requisitos

Arquivo: `src/cache.service.ts`

- [ ] `get(key)` retorna o valor guardado ou `null` se a chave não existir ou
      tiver expirado (entradas expiradas são removidas)
- [ ] Cada `get` que encontra valor conta um **hit**; cada `get` que retorna
      `null` conta um **miss**
- [ ] `set(key, data, ttl?)` guarda o valor com expiração em `ttl` **segundos**
      (padrão: `config.defaultTtl`)
- [ ] Ao inserir uma chave **nova** com o cache cheio (`maxEntries`), remove
      antes a entrada com menos hits (`removeLeastUsed`); em empate, a mais
      antiga
- [ ] `getOrFetch(key, fetchFn, ttl?)` retorna o valor em cache ou chama
      `fetchFn`, guarda e retorna o resultado; se `fetchFn` falhar, o erro é
      propagado e nada é guardado
- [ ] `invalidate(key)` remove a entrada e retorna `true` se ela existia,
      `false` caso contrário
- [ ] `clear()` remove todas as entradas
- [ ] `getStats()` retorna `hits`, `misses`, `size` (entradas atuais) e
      `hitRate = hits / (hits + misses)` (0 quando não houve acessos)
- [ ] `login`, `fetchUsers` e `fetchProducts` chamam a API com
      `Authorization: Bearer <token>` e lançam erro se a resposta não for 2xx
- [ ] `src/index.ts`: buscar os mesmos dados duas vezes com `getOrFetch`,
      mostrar o tempo de cada chamada, as estatísticas e invalidar o cache

## 🗂️ Estrutura dos Dados

```typescript
export interface CacheEntry<T> {
  key: string;
  data: T;
  expiresAt: number;
  hits: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
}

export interface CacheConfig {
  /** Default TTL in seconds */
  defaultTtl: number;
  maxEntries: number;
  persist: boolean;
  /** JSON file used when `persist` is true */
  filePath?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}
```

`data/api-response.json` mostra o formato das respostas da API.

## 🔌 API

| Método | Rota              | Uso             |
| ------ | ----------------- | --------------- |
| `POST` | `/api/auth/login` | Obter o token   |
| `GET`  | `/api/usuarios`   | Listar usuários |
| `GET`  | `/api/produtos`   | Listar produtos |

Todas as rotas (exceto login) exigem `Authorization: Bearer <token>`. Detalhes
em [`../API.md`](../API.md).

## 💡 Exemplo de Uso

```typescript
import { Cache, fetchUsers, login } from "./cache.service.ts";

const apiUrl = "https://api-mock-98te.onrender.com";
const token = await login(apiUrl, "joao@email.com", "123456");
const cache = new Cache<unknown[]>({
  defaultTtl: 300,
  maxEntries: 1000,
  persist: false,
});

const users = await cache.getOrFetch(
  "usuarios",
  () => fetchUsers(apiUrl, token),
);
await cache.getOrFetch("usuarios", () => fetchUsers(apiUrl, token)); // hit

console.log(cache.getStats());
await cache.invalidate("usuarios");
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [`Map` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Generics (TypeScript)](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [`Date.now()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
- [Políticas de substituição de cache — LRU/LFU (Wikipedia)](https://en.wikipedia.org/wiki/Cache_replacement_policies)

## 📝 Notas

- O `Map` mantém a ordem de inserção, o que ajuda a desempatar a remoção.
- Extra: quando `persist` for `true`, salve o cache em `filePath` (JSON) a cada
  alteração e carregue-o ao iniciar.
- Extra: limpeza automática periódica das entradas expiradas.
- Monitore o hit rate para ajustar o TTL.

---

**Dica:** Hit rate acima de 80% indica boa eficiência do cache.
