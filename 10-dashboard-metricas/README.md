# Desafio 10: Dashboard de Métricas

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Criar um serviço que envia métricas para a API mock, busca as métricas
registradas e calcula estatísticas agregadas (média, mínimo, máximo, p95, p99).

## 📋 Contexto Real

O time precisa monitorar:

- Tempo de resposta das APIs
- Taxa de erros
- Métricas de negócio (vendas, cadastros)

A média sozinha esconde os picos: por isso usamos percentis.

## 📐 Requisitos

Arquivo: `src/metric.service.ts`

- [ ] `login(apiUrl, email, password)` faz `POST /api/auth/login` e retorna o
      `token`
- [ ] `registerMetric(metric, apiUrl, token)` faz `POST /api/metricas` com
      `{ name, value, tags }` e o header `Authorization`; retorna `true` em 2xx
      e `false` em erro HTTP ou de rede, **sem lançar**
- [ ] `fetchMetrics(name, apiUrl, token)` faz `GET /api/metricas?name=<name>`
      com o token e retorna a lista; lança erro se a resposta não for 2xx
- [ ] `calculatePercentile(values, p)` usa o método _nearest-rank_: ordena uma
      **cópia** e retorna o elemento na posição `ceil(p/100 × n)` (1-based);
      lança erro para lista vazia
- [ ] `aggregateMetrics(metrics)` retorna `null` para lista vazia
- [ ] `aggregateMetrics` retorna `name` (da primeira métrica), `average`,
      `minimum`, `maximum`, `p95`, `p99`, `count` e `period` com o menor
      (`start`) e o maior (`end`) timestamp, independente da ordem da lista
- [ ] `generateSimulatedMetrics(apiUrl, token, name, count)` envia `count`
      métricas com o `name` informado e valores numéricos aleatórios `>= 0`
- [ ] `src/index.ts`: login → gerar métricas simuladas → buscar → agregar →
      exibir as estatísticas

## 🗂️ Estrutura dos Dados

```typescript
export interface Metric {
  name: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}

export interface AggregatedMetric {
  name: string;
  average: number;
  minimum: number;
  maximum: number;
  p95: number;
  p99: number;
  count: number;
  period: { start: string; end: string };
}
```

`data/metricas.json` mostra o formato das métricas retornadas pela API.

## 🔌 API

| Método | Rota                        | Uso                                               |
| ------ | --------------------------- | ------------------------------------------------- |
| `POST` | `/api/auth/login`           | Obter o token                                     |
| `POST` | `/api/metricas`             | Registrar métrica (`timestamp` é gerado pela API) |
| `GET`  | `/api/metricas?name=<nome>` | Listar métricas por nome                          |

Todas as rotas (exceto login) exigem `Authorization: Bearer <token>`. Detalhes
em [`../API.md`](../API.md).

## 💡 Exemplo de Uso

```typescript
import {
  aggregateMetrics,
  fetchMetrics,
  login,
  registerMetric,
} from "./metric.service.ts";

const apiUrl = "https://api-mock-98te.onrender.com";
const token = await login(apiUrl, "joao@email.com", "123456");

await registerMetric(
  { name: "response_time", value: 120, tags: { route: "/api/users" } },
  apiUrl,
  token,
);

const metrics = await fetchMetrics("response_time", apiUrl, token);
const stats = aggregateMetrics(metrics);
console.log(`P95: ${stats?.p95}ms`);
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Percentil — método nearest-rank (Wikipedia)](https://en.wikipedia.org/wiki/Percentile#The_nearest-rank_method)
- [`Array.prototype.toSorted()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)
- [`Math.min()` / `Math.max()` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/max)
- [`URLSearchParams` (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/URLSearchParams)
- [`Deno.serve` (para o extra do dashboard)](https://docs.deno.com/api/deno/~/Deno.serve)

## 📝 Notas

- `sort()` sem comparador ordena como string: `[10, 9].sort()` vira `[10, 9]`.
- Métricas não devem bloquear o fluxo principal: o envio pode falhar sem
  derrubar a aplicação (por isso `registerMetric` retorna `false`).
- Extra: servir as estatísticas via HTTP com `Deno.serve` e agregar por janela
  de tempo (downsampling).

---

**Dica:** Métricas devem ser leves. Não bloqueie o fluxo principal para coletar
métricas.
