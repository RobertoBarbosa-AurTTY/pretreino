# Desafio 33: Event Sourcing

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Implementar o padrão Event Sourcing para uma conta bancária: em vez de guardar
só o saldo atual, guardar a sequência imutável de eventos e reconstruir o estado
a partir deles (com suporte a snapshots e projeções).

## 📋 Contexto Real

Sistemas que precisam de auditoria completa:

- Sistema bancário (cada depósito/saque é um fato registrado)
- E-commerce com histórico de pedidos
- CRMs com trilha de alterações

## 📐 Requisitos

Todas as funções ficam em `src/eventstore.service.ts`. O aggregate de exemplo é
uma conta (`AccountState`) com os eventos:

| `type`           | `data`                                      | Efeito                            |
| ---------------- | ------------------------------------------- | --------------------------------- |
| `AccountOpened`  | `{ owner: string; initialBalance: number }` | cria a conta com `status: "open"` |
| `MoneyDeposited` | `{ amount: number }`                        | soma `amount` ao saldo            |
| `MoneyWithdrawn` | `{ amount: number }`                        | subtrai `amount` do saldo         |
| `AccountClosed`  | `{}`                                        | `status: "closed"`                |

**`createEventStore()`** (em memória)

- [ ] `append(event)` gera `id` e `timestamp` (ISO 8601) e retorna o evento
      salvo
- [ ] `append` exige `version` = última versão do aggregate + 1 (a primeira é
      `1`); caso contrário lança erro (concorrência otimista)
- [ ] `getEvents(aggregateId)` retorna apenas os eventos daquele aggregate, em
      ordem de `version` (`[]` se não houver)
- [ ] Eventos são imutáveis: alterar o array/objetos retornados não altera o que
      está no store
- [ ] `saveSnapshot` guarda o snapshot com `timestamp`; `getSnapshot` retorna o
      último salvo ou `null`

**`applyEvent(state, event)`**

- [ ] Retorna um **novo** estado (não muta o `state` recebido)
- [ ] `AccountOpened` com `state = null` cria a conta (`id = aggregateId`)
- [ ] Qualquer outro evento com `state = null` lança erro; `type` desconhecido
      lança erro

**`reconstructState(events, snapshot?)`**

- [ ] Aplica os eventos em ordem de `version` (mesmo que venham fora de ordem)
- [ ] Sem eventos e sem snapshot retorna `null`
- [ ] Com snapshot, parte de `snapshot.state` e aplica só os eventos com
      `version > snapshot.version`

**`buildBalanceProjection(events)`**

- [ ] Retorna um objeto `{ [aggregateId]: saldo }` com o saldo atual de cada
      conta

## 🗂️ Estrutura dos Dados

```typescript
export interface Event {
  id: string;
  aggregateId: string;
  type: string; // "AccountOpened" | "MoneyDeposited" | "MoneyWithdrawn" | "AccountClosed"
  data: unknown;
  timestamp: string;
  version: number;
}

export interface AccountState {
  id: string;
  owner: string;
  balance: number;
  status: "open" | "closed";
}

export interface Snapshot {
  aggregateId: string;
  state: AccountState;
  version: number;
  timestamp: string;
}

export interface EventStore {
  append(event: Omit<Event, "id" | "timestamp">): Event;
  getEvents(aggregateId: string): Event[];
  getSnapshot(aggregateId: string): Snapshot | null;
  saveSnapshot(snapshot: Omit<Snapshot, "timestamp">): void;
}
```

## 💡 Exemplo de Uso

```typescript
import {
  buildBalanceProjection,
  createEventStore,
  reconstructState,
} from "./eventstore.service.ts";

const store = createEventStore();
store.append({
  aggregateId: "acc-1",
  type: "AccountOpened",
  data: { owner: "Ana", initialBalance: 100 },
  version: 1,
});
store.append({
  aggregateId: "acc-1",
  type: "MoneyDeposited",
  data: { amount: 50 },
  version: 2,
});

const events = store.getEvents("acc-1");
const state = reconstructState(events); // { id: "acc-1", owner: "Ana", balance: 150, status: "open" }

store.saveSnapshot({ aggregateId: "acc-1", state: state!, version: 2 });

buildBalanceProjection(events); // { "acc-1": 150 }
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Event Sourcing (Martin Fowler)](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Object.freeze() (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
- [structuredClone() (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)
- [Array.prototype.reduce() (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

## 📝 Notas

- Eventos são fatos no passado: descrevem o que aconteceu, não o que deve
  acontecer
- Validações de negócio (ex.: saldo insuficiente) pertencem ao comando que gera
  o evento, não ao `applyEvent`
- Snapshots evitam reprocessar milhares de eventos a cada leitura
- Extra: persistir o store em arquivo JSON ou Deno KV
