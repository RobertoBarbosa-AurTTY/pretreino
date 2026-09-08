# Desafio 23: Cache com Redis

## 🎯 Objetivo

Implementar uma camada de cache usando Redis para otimizar consultas frequentes e reduzir carga no banco de dados.

## 📋 Contexto Real

Aplicações de alta performance precisam de cache:
- Reduzir latência de consultas
- diminuir carga no banco de dados
- Cache de sessões de usuário
- Rate limiting distribuído

## 📐 Requisitos

- [ ] Conectar ao Redis
- [ ] Implementar operações básicas (get, set, delete)
- [ ] Criar sistema de cache com TTL (Time To Live)
- [ ] Implementar padrão cache-aside
- [ ] Criar invalidação de cache por eventos
- [ ] Monitorar hit/miss rate

## 🗂️ Estrutura dos Dados

```typescript
interface CacheConfig {
  prefix: string;
  ttl: number; // em segundos
  serialize?: boolean;
}

interface CacheResult<T> {
  hit: boolean;
  data: T | null;
  fromCache: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  keysCount: number;
}

interface CacheInvalidation {
  pattern: string;
  evento: string;
  timestamps: string;
}
```

## 💡 Exemplo de Uso

```typescript
// Configurar cache para usuários
const userCache = new CacheService<Usuario>({
  prefix: "user:",
  ttl: 3600 // 1 hora
});

// Buscar com cache
const usuario = await userCache.getOrSet(
  "123",
  async () => await buscarUsuarioNoBanco("123")
);

// Invalidar cache quando usuário é atualizado
await userCache.invalidate("123");

// Invalidar todo o cache de usuários
await userCache.invalidatePattern("user:*");
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

- Use ioredis ou Redis do Deno
- Implemente circuit breaker para Redis
- Considere serialização/deserialização
- Monitore memória do Redis
- Implemente fallback para quando Redis cair

---

**Dica:** TTL variável ajuda a evitar "thundering herd" - adicione ±10% aleatório ao TTL base.