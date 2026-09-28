# Fundamentos 10: Event Emitter

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Construir um **EventEmitter tipado** (como o `node:events`) do zero, entender
por que os listeners rodam de forma **síncrona**, a semântica especial do evento
`"error"`, o aviso de _max listeners_ (detector de vazamento) e como transformar
um evento em Promise com `waitFor`.

## 🧠 Por que isso importa

- **Desafio 16 (WebSocket):** cada conexão emite `open`, `message` e `close`; o
  gerenciador de salas é essencialmente um emitter com um canal por sala.
- **Desafio 24 (fila de mensageria):** producers e consumers se comunicam por
  eventos (`message`, `failed`, `dead-letter`); `waitFor` é útil para esperar "o
  próximo job processado".
- **Desafio 40 (event driven):** o Event Bus em memória é um EventEmitter com
  retry, DLQ e histórico por cima.
- Streams, servidores HTTP e processos filhos do Node são EventEmitters. O aviso
  `MaxListenersExceededWarning` que você já pode ter visto é o mesmo mecanismo
  deste exercício — e quase sempre indica um listener registrado em loop, sem
  `off` (vazamento, veja o Fundamentos 08).

## 📖 Conceito

### Observer pattern

Quem emite não conhece quem escuta: ele só diz "aconteceu `X` com estes dados".
Isso desacopla módulos (o módulo de pedidos não precisa importar o de e-mail).

### Síncrono por padrão

`emit` chama os listeners **na hora**, um após o outro, na mesma pilha de
chamadas. Não há microtask nem task envolvida:

```ts
emitter.on("x", () => console.log("listener"));
console.log("antes");
emitter.emit("x");
console.log("depois"); // antes, listener, depois
```

Consequências:

- uma exceção num listener **sobe para quem chamou `emit`** e impede os
  listeners seguintes de rodarem;
- um listener lento bloqueia o emissor (e o event loop inteiro, veja o
  Fundamentos 01). Para trabalho pesado, o listener deve agendar a tarefa
  (`queueMicrotask`, `setTimeout`) ou ser `async` — lembrando que o emitter
  **não aguarda** a Promise retornada.

### O evento `"error"`

Por convenção do Node, `"error"` é especial: se ninguém escuta e ele é emitido,
o erro é **lançado**. A lógica é: um erro que ninguém trata não pode sumir em
silêncio.

### Tipagem com mapa de eventos

```ts
type Events = { message: [text: string]; close: [] };

class Typed<E extends Record<string, unknown[]>> {
  on<K extends keyof E & string>(event: K, fn: (...args: E[K]) => void) {
    /* ... */
  }
}
```

`E[K]` é uma tupla, e `...args: E[K]` faz o TypeScript checar a quantidade e o
tipo dos argumentos de cada evento — tanto no `on` quanto no `emit`.

### Evento → Promise

`waitFor` é uma "ponte": registra listeners temporários, resolve/rejeita **uma
vez** e limpa tudo. O `node:events` tem o equivalente `once(emitter, name)`.

## ✍️ Exercícios

Arquivo: `src/event-emitter.ts`

- [ ] `on(event, listener)` registra e devolve `this`
- [ ] `emit(event, ...args)`
  - [ ] chama os listeners de forma síncrona, na ordem de registro
  - [ ] devolve `true` se havia listeners, `false` se não
  - [ ] listeners adicionados/removidos durante o `emit` não afetam aquele
        `emit`
  - [ ] `emit("error", err)` sem listener de `"error"` lança `err` (se não for
        `Error`, lança um `Error` que o descreva)
- [ ] `once(event, listener)` roda no máximo uma vez; `off` com o listener
      original também o remove
- [ ] `off(event, listener)` remove uma ocorrência (a última registrada)
- [ ] `listenerCount(event)`, `eventNames()` (só eventos com listeners) e
      `removeAllListeners(event?)`
- [ ] Limite de listeners: padrão `DEFAULT_MAX_LISTENERS` (10), configurável no
      construtor e por `setMaxListeners(n)` (0 = sem limite); ao ultrapassar,
      `console.warn` **uma vez** por evento
- [ ] `waitFor(emitter, event, { timeoutMs, signal })`
  - [ ] resolve com a tupla de argumentos do próximo `event`
  - [ ] rejeita com `TimeoutError` ao estourar `timeoutMs`
  - [ ] rejeita com o erro se `"error"` for emitido antes
  - [ ] rejeita com `signal.reason` se o `AbortSignal` for abortado
  - [ ] em qualquer desfecho remove os listeners que registrou e limpa o timer

## 🔮 Preveja antes de rodar

Considere um emitter qualquer no estilo do `node:events` (ou o seu, pronto).

**1.** Síncrono ou assíncrono?

```ts
const e = new EventEmitter<{ ping: [] }>();
e.on("ping", () => console.log("B"));
console.log("A");
e.emit("ping");
Promise.resolve().then(() => console.log("D"));
console.log("C");
```

**2.** Exceção num listener

```ts
const e = new EventEmitter<{ go: [] }>();
e.on("go", () => {
  throw new Error("boom");
});
e.on("go", () => console.log("segundo"));
try {
  e.emit("go");
} catch (err) {
  console.log("capturado:", (err as Error).message);
}
```

**3.** Listener `async` com erro

```ts
const e = new EventEmitter<{ go: [] }>();
e.on("go", async () => {
  throw new Error("async boom");
});
try {
  e.emit("go");
  console.log("emit terminou sem erro");
} catch {
  console.log("capturado");
}
```

**4.** `once` + `emit` dentro do próprio listener

```ts
const e = new EventEmitter<{ tick: [n: number] }>();
e.once("tick", (n) => {
  console.log("tick", n);
  e.emit("tick", n + 1);
});
e.emit("tick", 1);
```

<details><summary>Resposta</summary>

1. `A`, `B`, `C`, `D` — o listener roda dentro do `emit`; só o `.then` vai para
   a fila de microtasks.
2. `capturado: boom` — e `segundo` **não** aparece: a exceção interrompe o
   `emit` e sobe para quem chamou.
3. `emit terminou sem erro` — o listener devolve uma Promise rejeitada que
   ninguém aguarda; o `try/catch` não vê nada e o runtime depois reporta uma
   _unhandled rejection_ (no Deno, isso encerra o processo).
4. Apenas `tick 1` — o `once` precisa se remover **antes** de chamar o listener;
   assim o `emit` interno não encontra mais ninguém.

</details>

## ⚙️ Como rodar

```bash
deno task dev
```

Enquanto nada estiver implementado, termina com `Not implemented`.

## 🚀 Desafio extra

1. Adicione `prependListener` e um evento especial `"newListener"` emitido antes
   de cada registro (como no Node).
2. Crie `on(emitter, event)` que devolve um `AsyncIterableIterator` com os
   argumentos de cada emissão (`for await (const [msg] of on(bus, "message"))`),
   com buffer e cancelamento no `break` — combine com o Fundamentos 06.
3. Faça um `AsyncEventEmitter` cujo `emitAsync` aguarda todos os listeners
   (`Promise.allSettled`) e agrega os erros num `AggregateError` — a base do
   retry do desafio 40.

## 📚 Referências

- [Node.js — Events](https://nodejs.org/api/events.html)
- [MDN — EventTarget](https://developer.mozilla.org/pt-BR/docs/Web/API/EventTarget)
- [javascript.info — Custom events / Observer (mixins)](https://javascript.info/mixins#eventmixin)
- [Refactoring Guru — Observer](https://refactoring.guru/pt-br/design-patterns/observer)
- [TypeScript Handbook — Variadic tuple types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
