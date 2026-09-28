# Fundamentos 01: Event Loop

**Dificuldade:** ⭐

## 🎯 Objetivo

Entender como o JavaScript executa código assíncrono com **uma única thread**:
call stack, fila de **microtasks** (Promises, `queueMicrotask`, continuação de
`await`) e fila de **macrotasks** (timers, I/O). No fim você deve conseguir
prever a ordem de qualquer mistura de `setTimeout`, `Promise.then`,
`queueMicrotask` e `await`.

## 🧠 Por que isso importa

- O desafio **09** (processamento de fila) e o **29** (processamento assíncrono)
  dependem de saber quando um job realmente começa a rodar e por que um `for`
  síncrono pesado trava todos os outros.
- O desafio **04** (importação de CSV) processa arquivos grandes: sem ceder o
  controle ao event loop entre lotes, o servidor para de responder durante a
  importação — é exatamente o `processInChunks` deste exercício.
- Os desafios **15** (rate limiting), **21** (job scheduler) e **48** (task
  scheduler) usam timers; entender que `setTimeout(fn, 100)` significa "no
  mínimo 100ms" evita bugs de agendamento.
- O desafio **35** (resilience patterns) usa `sleep` para backoff entre
  tentativas.

## 📖 Conceito

### As peças

```
┌──────────────┐     ┌────────────────────────┐
│  Call stack  │ ◄── │ Microtasks (esvazia    │  Promise.then, queueMicrotask,
│ (código sync)│     │ TODA antes de seguir)  │  continuação depois de await
└──────┬───────┘     └────────────────────────┘
       │ stack vazia
       ▼
┌────────────────────────┐
│ Macrotasks (uma por    │  setTimeout, setInterval, I/O, eventos
│ volta do loop)         │
└────────────────────────┘
```

Uma volta do loop, de forma simplificada:

1. Pega **uma** macrotask e executa até a call stack esvaziar.
2. Executa **todas** as microtasks pendentes (inclusive as que forem criadas
   durante esse processo).
3. Volta para o passo 1.

Consequência: microtasks sempre "furam a fila" dos timers.

```ts
setTimeout(() => console.log("timer"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("sync");
// sync → promise → timer
```

### `await` é açúcar para `.then`

Tudo que vem **depois** de um `await` dentro de uma função `async` é agendado
como microtask. A parte **antes** do primeiro `await` roda de forma síncrona.

```ts
async function f() {
  console.log("1 - antes do await (síncrono)");
  await null;
  console.log("3 - depois do await (microtask)");
}
f();
console.log("2 - depois de chamar f()");
```

### Timers são um _mínimo_, não uma promessa

`setTimeout(fn, 0)` só roda quando a call stack estiver vazia **e** todas as
microtasks tiverem acabado. Se você bloquear a thread por 2 segundos com um loop
síncrono, o timer de 0ms espera 2 segundos. Em um servidor, isso significa que
**nenhuma** requisição é atendida durante esse tempo.

### Ceder o controle (yield)

Para trabalho pesado, quebre em pedaços e, entre eles, espere uma **macrotask**
(não uma microtask!). Uma microtask não deixa timers nem I/O rodarem, porque a
fila de microtasks é esvaziada inteira antes de o loop seguir.

### Deno vs Node

Node tem `process.nextTick`, uma fila que roda antes até das Promises. No Deno
(e no browser) o equivalente padrão é `queueMicrotask`. O `defer` deste
exercício é o seu "nextTick".

## ✍️ Exercícios

Arquivo: `src/event-loop.ts`

- [ ] `sleep(ms)` retorna uma Promise que resolve depois de **pelo menos** `ms`
      milissegundos
- [ ] `defer(fn)` agenda `fn` como **microtask** (use `queueMicrotask`); não
      executa `fn` de forma síncrona
- [ ] `yieldToEventLoop()` resolve em uma **macrotask futura** (um timer que já
      estava agendado deve rodar antes dela resolver)
- [ ] `runInOrder(tasks)` agenda cada tarefa, na ordem do array, conforme
      `kind`:
  - `"sync"` → executa na hora
  - `"microtask"` → `queueMicrotask`
  - `"promise"` → `Promise.resolve().then(...)`
  - `"timeout"` → `setTimeout(..., delayMs ?? 0)`
- [ ] `runInOrder` registra o `label` de cada tarefa **no momento em que ela
      executa** e resolve com esse array só depois que **todas** executaram
      (lista vazia resolve com `[]`)
- [ ] `busyWait(ms)` bloqueia a thread com um loop síncrono por pelo menos `ms`
      milissegundos (use `performance.now()` ou `Date.now()`)
- [ ] `measureTimerDelay(blockMs)` agenda um `setTimeout(..., 0)`, chama
      `busyWait(blockMs)` e resolve com o tempo real até o callback do timer
      rodar (deve ser `>= blockMs`)
- [ ] `processInChunks(items, chunkSize, fn)` aplica `fn(item, index)` em lotes
      de `chunkSize`, chamando `yieldToEventLoop()` entre os lotes, e resolve
      com os resultados na ordem original
- [ ] `processInChunks` lança `RangeError` se `chunkSize < 1`

## 🔮 Preveja antes de rodar

Escreva a saída de cada trecho **no papel** antes de rodar (cole num arquivo
`scratch.ts` e rode com `deno run scratch.ts`).

**1. O clássico**

```ts
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
queueMicrotask(() => console.log("D"));
console.log("E");
```

<details><summary>Resposta</summary>

`A E C D B` — código síncrono primeiro (`A`, `E`), depois todas as microtasks na
ordem em que foram agendadas (`C`, `D`), e só então o timer (`B`).

</details>

**2. `await` no meio**

```ts
async function run() {
  console.log("1");
  await Promise.resolve();
  console.log("2");
  setTimeout(() => console.log("3"), 0);
  await null;
  console.log("4");
}
setTimeout(() => console.log("5"), 0);
run();
console.log("6");
```

<details><summary>Resposta</summary>

`1 6 2 4 5 3` — `1` roda síncrono dentro de `run()`; `6` é o resto do código
síncrono; `2` e `4` são continuações de `await` (microtasks, rodam antes de
qualquer timer); `5` foi agendado antes de `3`, então roda primeiro.

</details>

**3. Microtask que agenda microtask**

```ts
setTimeout(() => console.log("timer"), 0);
function loop(n: number) {
  if (n === 0) return;
  queueMicrotask(() => {
    console.log("micro", n);
    loop(n - 1);
  });
}
loop(3);
```

<details><summary>Resposta</summary>

`micro 3`, `micro 2`, `micro 1`, `timer` — a fila de microtasks é esvaziada
**inteira**, inclusive as microtasks criadas durante o esvaziamento. Se `loop`
nunca parasse, o timer **nunca** rodaria (starvation).

</details>

**4. Bloqueando o loop**

```ts
const start = Date.now();
setTimeout(() => console.log("timer após", Date.now() - start, "ms"), 10);
while (Date.now() - start < 500) {
  // bloqueando...
}
console.log("loop terminou");
```

<details><summary>Resposta</summary>

`loop terminou` e depois `timer após ~500 ms` — o timer de 10ms só pode rodar
quando a call stack esvazia, ou seja, depois do `while`.

</details>

## ⚙️ Como rodar

```bash
deno task dev
```

Cada seção imprime `esperado` vs `obtido`. Enquanto uma função não estiver
implementada, a seção mostra `❌ Not implemented`.

## 🚀 Desafio extra

1. Implemente `setImmediateLike(fn)` usando `MessageChannel` (uma macrotask sem
   o atraso mínimo de ~1–4ms que alguns ambientes aplicam a timers aninhados) e
   compare com `setTimeout(fn, 0)` em 1000 iterações.
2. Escreva `detectLoopLag(intervalMs)`: um `setInterval` que mede quanto cada
   tick atrasou em relação ao esperado e imprime um aviso se passar de 50ms (é
   como ferramentas de APM medem "event loop lag" — relacionado ao desafio
   **49**).
3. Faça um `sleep` cancelável que aceita um `AbortSignal` e rejeita com
   `signal.reason` quando abortado (limpando o timer).

## 📚 Referências

- [MDN — O event loop / modelo de concorrência](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Event_loop)
- [javascript.info — Event loop: microtasks and macrotasks](https://javascript.info/event-loop)
- [Jake Archibald — Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [Jake Archibald — In The Loop (JSConf, vídeo)](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
- [MDN — queueMicrotask](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask)
