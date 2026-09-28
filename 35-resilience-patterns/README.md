# Desafio 35: Resilience Patterns

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar os principais padrões de resiliência para chamadas a serviços
instáveis: Circuit Breaker, Bulkhead, Retry com backoff, Timeout e Fallback.

## 📋 Contexto Real

Sistemas distribuídos falham:

- Serviços indisponíveis ou lentos
- Timeouts de rede
- Sobrecarga de recursos (um serviço lento consome todas as conexões)

Sem proteção, uma falha em um serviço se propaga em cascata para todo o sistema.

## 📐 Requisitos

Tudo fica em `src/resilience.service.ts`.

**`CircuitBreaker(threshold, resetTimeout)`**

- [ ] Estado `closed`: executa `fn` e repassa resultado/erro; cada falha
      incrementa `failures`; um sucesso zera `failures`
- [ ] Ao atingir `threshold` falhas consecutivas, passa para `open`
- [ ] Em `open`, `execute` rejeita com erro cuja mensagem contém
      `"Circuit breaker is open"` **sem chamar** `fn`
- [ ] Após `resetTimeout` ms desde a última falha, a próxima chamada passa
      (`half-open`): sucesso → `closed` com `failures = 0`; falha → `open` de
      novo
- [ ] `getStatus()` (já fornecido) reflete o estado atual

**`Bulkhead(maxConcurrent, maxQueue)`**

- [ ] No máximo `maxConcurrent` execuções simultâneas; as excedentes aguardam
      numa fila (FIFO)
- [ ] Se a fila já tem `maxQueue` itens, `execute` rejeita com erro contendo
      `"Bulkhead full"`
- [ ] A vaga é liberada quando a tarefa termina, **com sucesso ou com erro**

**`Retry(maxRetries, delay, backoff)`**

- [ ] Faz até `1 + maxRetries` tentativas; retorna o primeiro sucesso
- [ ] Se todas falharem, rejeita com o erro da **última** tentativa
- [ ] Espera antes da tentativa `n` (n = 1, 2, 3…): `exponential` →
      `delay * 2^(n-1)`; `linear` → `delay * n`

**`withTimeout(fn, ms)`**

- [ ] Resolve com o resultado de `fn` se terminar em até `ms` ms
- [ ] Caso contrário rejeita com erro cuja mensagem contém `"Timeout"` (e limpa
      o timer quando `fn` termina antes)

**`withFallback(fn, fallback)`**

- [ ] Retorna o resultado de `fn` se tiver sucesso
- [ ] Se `fn` falhar, retorna `fallback(error)` (recebendo o erro original)

## 🗂️ Estrutura dos Dados

```typescript
export class CircuitBreaker {
  constructor(threshold: number, resetTimeout: number);
  execute<T>(fn: () => Promise<T>): Promise<T>;
  getStatus(): { status: "closed" | "open" | "half-open"; failures: number };
}

export class Bulkhead {
  constructor(maxConcurrent: number, maxQueue: number);
  execute<T>(fn: () => Promise<T>): Promise<T>;
}

export class Retry {
  constructor(
    maxRetries: number,
    delay: number,
    backoff?: "linear" | "exponential", // padrão: "exponential"
  );
  execute<T>(fn: () => Promise<T>): Promise<T>;
}

export function withTimeout<T>(fn: () => Promise<T>, ms: number): Promise<T>;

export function withFallback<T>(
  fn: () => Promise<T>,
  fallback: (error: unknown) => T | Promise<T>,
): Promise<T>;
```

## 💡 Exemplo de Uso

```typescript
import {
  Bulkhead,
  CircuitBreaker,
  Retry,
  withFallback,
  withTimeout,
} from "./resilience.service.ts";

const breaker = new CircuitBreaker(5, 60000);
const bulkhead = new Bulkhead(10, 5);
const retry = new Retry(3, 200, "exponential");

const callInventory = () =>
  withTimeout(() => fetch("http://localhost:3001/estoque"), 2000);

const response = await withFallback(
  () =>
    breaker.execute(() => bulkhead.execute(() => retry.execute(callInventory))),
  () => Response.json({ items: [], fromCache: true }),
);
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Circuit Breaker (Martin Fowler)](https://martinfowler.com/bliki/CircuitBreaker.html)
- [setTimeout (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/setTimeout)
- [Promise.race() (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [Promise.withResolvers() (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)

## 📝 Notas

- Circuit Breaker evita martelar um serviço que já está fora do ar
- Bulkhead isola recursos: um serviço lento não consome todas as vagas
- Retry sempre com limite e backoff (e, em produção, com jitter)
- Use Circuit Breaker para chamadas externas e Bulkhead para recursos
  compartilhados
- Para guardar o id de um timer, tipe como `ReturnType<typeof setTimeout>`
