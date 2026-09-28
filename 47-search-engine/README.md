# Desafio 47: Search Engine

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar um mini motor de busca full-text em memória, com índice invertido,
score de relevância, filtros, paginação, destaque de termos e autocomplete.

## 📋 Contexto Real

Buscar produtos, clientes ou chamados com `LIKE '%texto%'` não escala e não
ordena por relevância. Motores como Elasticsearch e MeiliSearch usam:

- **Tokenização e normalização** (minúsculas, sem acentos)
- **Índice invertido**: termo → documentos que o contêm
- **Scoring**: documentos mais relevantes primeiro
- **Autocomplete** e **highlight** para a interface

## 📐 Requisitos

- [ ] Tokenização: texto em minúsculas, **sem acentos** (`"Confortável"` →
      `"confortavel"`), quebrado em tudo que não é letra ou dígito
- [ ] `index(doc)` indexa todos os valores de `doc.fields`; indexar um `id` já
      existente **substitui** o documento anterior
- [ ] `search({ text })` retorna apenas documentos que contêm **todos** os
      termos da consulta (AND); texto vazio/só espaços → `[]`
- [ ] `score` = total de ocorrências dos termos da consulta no documento (sempre
      `> 0`); resultados em ordem decrescente de `score`
- [ ] `filters`: cada chave é comparada por igualdade com `doc.type` (chave
      `"type"`) ou com `doc.fields[chave]`; todos os filtros precisam bater
- [ ] Paginação: aplica `offset` (padrão `0`) e `limit` (padrão `10`) **depois**
      de ordenar
- [ ] `highlights`: para cada campo que contém algum termo, o valor original do
      campo com cada termo encontrado envolvido em `<mark>…</mark>` (ex:
      `"<mark>Cadeira</mark> gamer"`); campos sem termo não aparecem
- [ ] `remove(id)` tira o documento do índice
- [ ] `autocomplete(prefix)` retorna termos indexados (normalizados) que começam
      com o prefixo normalizado, sem repetição, em ordem alfabética, no máximo
      10
- [ ] `src/index.ts`: indexa alguns documentos de exemplo e imprime buscas e
      sugestões

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

interface SearchEngine {
  index(doc: Document): void;
  search(query: SearchQuery): SearchResult[];
  remove(id: string): void;
  autocomplete(prefix: string): string[];
}
```

## 💡 Exemplo de Uso

```typescript
import { createEngine } from "./search.service.ts";

const engine = createEngine();

engine.index({
  id: "p1",
  type: "produto",
  fields: { name: "Notebook Dell", description: "Notebook leve para trabalho" },
  indexedAt: new Date().toISOString(),
});

const results = engine.search({
  text: "notebook",
  filters: { type: "produto" },
  limit: 5,
});
console.log(results[0]?.score); // 2
console.log(results[0]?.highlights.name); // "<mark>Notebook</mark> Dell"

console.log(engine.autocomplete("not")); // ["notebook"]
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Índice invertido (Wikipedia)](https://en.wikipedia.org/wiki/Inverted_index)
- [String.prototype.normalize (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  — `normalize("NFD")` para remover acentos
- [Map e Set (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [TF-IDF (Wikipedia)](https://pt.wikipedia.org/wiki/Tf%E2%80%93idf)

## 📝 Notas

- Indexe apenas campos pesquisáveis, não tudo
- Extra: TF-IDF ou BM25 no lugar da contagem simples de ocorrências
- Extra: stemming (`"notebooks"` → `"notebook"`), stopwords (`"de"`, `"para"`) e
  facets (contagem por `type`/categoria)
- Compare depois com Elasticsearch ou MeiliSearch
