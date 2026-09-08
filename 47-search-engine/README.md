# Desafio 47: Search Engine

## 🎯 Objetivo

Implementar motor de busca com indexação e relevant scoring.

## 📋 Contexto Real

Busca em aplicações:
- Catálogos de produtos
- Conteúdo
- Documentos

## 📐 Requisitos

- [ ] Indexar documentos
- [ ] Implementar full-text search
- [ ] Scoring de relevância
- [ ] Autocomplete
- [ ] Filtros e facets

## 🗂️ Estrutura dos Dados

```typescript
interface Document {
  id: string;
  type: string;
  fields: Record<string, string>;
  indexedAt: string;
}

interface SearchResult {
  document: Document;
  score: number;
  highlights: Record<string, string>;
}

interface SearchQuery {
  text: string;
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
}
```

## ⚙️ Setup

```bash
deno task dev
```

## 📝 Notas

- Considere Elasticsearch ou MeiliSearch
- Implemente stemming
- Cache queries frequentes

---

**Dica:** Indexe apenas campos pesquisáveis, não tudo.