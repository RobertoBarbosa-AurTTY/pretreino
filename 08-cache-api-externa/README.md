# Desafio 8: Cache de API Externa

## 🎯 Objetivo

Criar um sistema de cache para chamadas a APIs externas, reduzindo chamadas repetidas.

## 📋 Contexto Real

O sistema consome uma API externa que:
- Cobra por chamada
- Tem limite de requisições
- Resposta rarely muda

Solução: Implementar cache em memória e persistido.

## 📐 Requisitos

- [ ] Cache em memória (rápido)
- [ ] Cache persistido (arquivo/Redis)
- [ ] TTL (Time To Live) configurável
- [ ] Invalidação de cache
- [ ] Log de hits/misses

## 🗂️ Estrutura dos Dados

```typescript
interface CacheEntry<T> {
  chave: string;
  dados: T;
  dataExpiracao: number;
  hits: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  tamanho: number;
}

interface ConfiguracaoCache {
  ttlPadrao: number;  // em segundos
  maxEntradas: number;
  persistir: boolean;
}
```

## 💡 Exemplo de Uso

```typescript
const cache = new Cache({ ttlPadrao: 300, maxEntradas: 1000 });

// Buscar com cache
const dados = await cache.buscarOuBuscar(
  "usuarios_123",
  () => buscarUsuarioAPI("123")
);

// Invalidar cache
await cache.invalidar("usuarios_123");
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

- Use Map para cache em memória
- Implemente LRU (Least Recently Used) para limite de entrada
- Considere serialização para persistência
- Monitore hit rate para otimizar TTL

---

**Dica:** Hit rate acima de 80% indica boa eficiência do cache.
