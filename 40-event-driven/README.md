# Desafio 40: Event Driven Architecture

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar um Event Bus em memória com producers e consumers desacoplados,
retry de consumers, dead letter queue (DLQ) e replay do histórico de eventos.

## 📋 Contexto Real

Sistemas desacoplados:

- Microserviços comunicando via eventos (`order.created` → estoque, email,
  faturamento)
- Processamento assíncrono
- Um consumer novo precisa "alcançar" eventos que já aconteceram (replay)
- Eventos que nunca conseguem ser processados não podem sumir (DLQ)

## 📐 Requisitos

Tudo fica em `src/eventbus.service.ts`.

**`createEventBus(options?)` → `publish(event)`**

- [ ] Rejeita com erro contendo `"invalid"` se o evento não tiver `id` ou `type`
- [ ] Guarda o evento no histórico (em ordem de publicação)
- [ ] Entrega a todos os handlers inscritos no `type` e aos inscritos em `"*"`
      (curinga), aguardando todos
- [ ] Um handler que falha **não** faz o `publish` rejeitar e não impede a
      entrega aos demais
- [ ] Handler que falha é tentado de novo até `options.maxRetries` vezes (padrão
      `0`), ou seja `1 + maxRetries` tentativas
- [ ] Se todas as tentativas falharem, adiciona um `DeadLetter` com o evento, a
      mensagem do último erro, o número de tentativas e `failedAt`

**`subscribe(type, handler)` / `unsubscribe(type, handler)`**

- [ ] Inscrever o mesmo handler duas vezes no mesmo tipo entrega o evento só uma
      vez
- [ ] Depois de `unsubscribe`, o handler não recebe mais eventos daquele tipo

**`getHistory()` / `getDeadLetters()`**

- [ ] Retornam cópias da lista de eventos publicados e da DLQ

**`replay(filter?)`**

- [ ] Reentrega os eventos do histórico aos handlers inscritos **agora**, na
      ordem original
- [ ] `filter.type` limita a um tipo; `filter.since` limita a eventos com
      `timestamp >= since`
- [ ] Não adiciona os eventos de novo ao histórico; retorna quantos eventos
      foram reentregues

## 🗂️ Estrutura dos Dados

```typescript
export interface Event {
  id: string;
  type: string;
  payload: unknown;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface EventHandler {
  handle(event: Event): Promise<void>;
}

export interface DeadLetter {
  event: Event;
  error: string;
  attempts: number;
  failedAt: string;
}

export interface EventBusOptions {
  maxRetries?: number; // extra attempts per handler before dead-lettering (default 0)
}

export interface EventBus {
  publish(event: Event): Promise<void>;
  subscribe(type: string, handler: EventHandler): void;
  unsubscribe(type: string, handler: EventHandler): void;
  getHistory(): Event[];
  getDeadLetters(): DeadLetter[];
  replay(filter?: { type?: string; since?: string }): Promise<number>;
}
```

## 💡 Exemplo de Uso

```typescript
import { createEventBus } from "./eventbus.service.ts";

const bus = createEventBus({ maxRetries: 2 });

// consumers
bus.subscribe("order.created", {
  async handle(event) {
    console.log("Reservando estoque para", event.payload);
  },
});
bus.subscribe("*", {
  async handle(event) {
    console.log("[audit]", event.type);
  },
});

// producer
await bus.publish({
  id: crypto.randomUUID(),
  type: "order.created",
  payload: { orderId: "123" },
  timestamp: new Date().toISOString(),
});

console.log(bus.getDeadLetters()); // eventos que nenhum retry conseguiu processar
await bus.replay({ type: "order.created" }); // reentrega para os consumers atuais
```

## ⚙️ Setup

```bash
cp .env.example .env
deno task dev
```

## 📚 Conceitos

- [Event-Driven Architecture (Martin Fowler)](https://martinfowler.com/articles/201701-event-driven.html)
- [Set (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [Promise.allSettled() (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [EventTarget (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/EventTarget)

## 📝 Notas

- Eventos representam fatos, não comandos — e são imutáveis
- Em produção, consumers devem ser idempotentes (veja o Desafio 39): replay e
  retry podem entregar o mesmo evento mais de uma vez
- Extras: backoff entre retries, reprocessar itens da DLQ, garantir ordem por
  chave (ex.: `orderId`)
