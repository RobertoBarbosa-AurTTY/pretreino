# Desafio 43: Response Caching

## 🎯 Objetivo

Implementar cache de responses HTTP com invalidação inteligente.

## 📋 Contexto Real

Performance de APIs:
- Reduzir carga no servidor
- Respostas mais rápidas
- Economizar recursos

## 📐 Requisitos

- [ ] Implementar cache por rota
- [ ] Configurar TTL
- [ ] Invalidação por evento
- [ ] Cache condicional (ETag)
- [ ] Métricas de cache

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
  ttl: number;
  maxSize: number;
  strategy: "lru" | "lfu" | "fifo";
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Use Cache-Control headers
- Implemente ETag para revalidação
- Considere cache distribuído (Redis)

---

**Dica:** Cache por URL completa, incluindo query parameters.