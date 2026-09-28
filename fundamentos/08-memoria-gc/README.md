# Fundamentos 08: Memória e Garbage Collection

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Entender **como o V8 decide o que pode ser liberado** (alcançabilidade), por que
processos Node/Deno de longa duração vazam memória, e como `WeakMap`, `WeakRef`
e `FinalizationRegistry` ajudam. Você vai implementar três caches, um medidor de
heap, e aprender a investigar vazamentos com heap snapshots.

## 🧠 Por que isso importa

Um servidor HTTP roda por dias. Qualquer estrutura que só cresce vira um
vazamento que derruba o processo com `JavaScript heap out of memory`.

- Os caches dos desafios 08 (cache de API externa), 23 (cache Redis, na versão
  em memória) e 43 (response caching) só não vazam porque têm **TTL e limite de
  entradas**. Sem isso, seriam um `createLeakyCache`.
- O rate limiter do desafio 15 guarda um contador por IP: sem limpeza, cada IP
  novo fica para sempre na memória.
- O desafio 16 (WebSocket) guarda conexões em `Map`s de clientes e salas:
  esquecer de removê-las no `close` é o vazamento mais comum em apps de tempo
  real.
- Os schedulers dos desafios 21 e 48 criam `setInterval`: um timer não cancelado
  mantém vivo tudo o que seu callback captura.

## 📖 Conceito

### Alcançabilidade (reachability)

O GC não "conta referências": ele parte das **raízes** (variáveis globais, pilha
de chamadas atual, closures ativas, timers e listeners registrados, módulos
carregados) e marca tudo que é alcançável seguindo referências. O que **não**
foi marcado é lixo e pode ser liberado (_mark-and-sweep_). Por isso ciclos
(`a.b = b; b.a = a`) não são problema quando ninguém de fora aponta para eles.

### Gerações

O V8 divide o heap em **young generation** (objetos novos, coletados muito
rápido pelo _Scavenger_) e **old generation** (objetos que sobreviveram a
algumas coletas, coletados pelo _Mark-Compact_, mais caro). A maioria dos
objetos morre jovem — criar objetos temporários é barato; mantê-los vivos sem
necessidade é o que custa.

### Vazamentos comuns

```ts
// 1. Estrutura global que só cresce
const seen: Request[] = [];
function handler(req: Request) {
  seen.push(req); // nunca é removido
}

// 2. Timer esquecido: o closure mantém `bigData` vivo para sempre
function start(bigData: Uint8Array) {
  setInterval(() => console.log(bigData.length), 1000);
}

// 3. Listener nunca removido
emitter.on("tick", () => usar(bigObject));

// 4. Closure capturando mais do que precisa
function makeGetter(report: { rows: unknown[]; title: string }) {
  return () => report.title; // mantém `rows` vivo junto
}
```

### Referências fracas

- **`WeakMap` / `WeakSet`:** a chave (sempre um objeto) é referenciada de forma
  fraca. Se ela só é alcançável pelo WeakMap, a entrada some. Por isso **não
  existe** `size`, `keys()` ou iteração: o resultado dependeria de quando o GC
  rodou, e o spec proíbe esse não-determinismo observável.
- **`WeakRef`:** referência fraca a um objeto; `ref.deref()` devolve o objeto ou
  `undefined` se ele já foi coletado.
- **`FinalizationRegistry`:** registra um callback chamado _algum tempo depois_
  de um objeto ser coletado. **Nunca** use para lógica essencial — pode demorar
  ou nem acontecer (ex.: o processo terminou antes).

### Investigando com heap snapshot

1. Rode com o inspetor: `deno run --inspect-brk --allow-read src/index.ts`
2. Abra `chrome://inspect` no Chrome e clique em **inspect** no alvo do Deno.
3. Aba **Memory** → **Heap snapshot** → _Take snapshot_ (tire um antes e outro
   depois da operação suspeita).
4. Selecione o segundo snapshot e mude a visão para **Comparison**: ordene por
   _# Delta_ / _Size Delta_ para ver quais construtores cresceram.
5. Clique num objeto e veja o painel **Retainers**: é a cadeia de referências
   que o mantém vivo até uma raiz — é ali que o vazamento aparece.

Para leituras rápidas no código, `Deno.memoryUsage()` devolve `rss`,
`heapTotal`, `heapUsed` e `external` (memória fora do heap do V8, como o
conteúdo de `ArrayBuffer`s).

## ✍️ Exercícios

Arquivo: `src/memory.ts`

- [ ] `createLeakyCache()` — implementação com `Map`, com `get`, `set`, `has`,
      `delete` e `size()`
- [ ] `createWeakCache()` — mesma interface (sem `size`) usando `WeakMap`
- [ ] `createWeakRefCache({ onCollect })`
  - [ ] guarda `Map<K, WeakRef<V>>`
  - [ ] `get` faz `deref()`; se o valor morreu, remove a entrada e devolve
        `undefined`
  - [ ] um `FinalizationRegistry` remove entradas cujos valores foram coletados,
        incrementa `collectedCount()` e chama `onCollect(key)`
  - [ ] sobrescrever uma chave com `set` não pode fazer a finalização do valor
        antigo apagar o novo
- [ ] `measureHeap(fn)`
  - [ ] lê `Deno.memoryUsage().heapUsed` antes e depois, aguardando `fn` se for
        async
  - [ ] chama `globalThis.gc()` antes de cada leitura quando ele existir
  - [ ] devolve `result`, `heapBefore`, `heapAfter`, `deltaBytes` e `durationMs`
- [ ] `formatBytes(bytes)` — `B`, `KB`, `MB`, `GB` com uma casa decimal (exceto
      `B`), preservando o sinal

A task `dev` já roda com `--v8-flags=--expose-gc`, então `globalThis.gc` está
disponível. Compare o crescimento do heap do cache vazante com o do `WeakMap`.

## 🔮 Preveja antes de rodar

Rode com `deno run --v8-flags=--expose-gc arquivo.ts`.

**1.** WeakMap perde a entrada?

```ts
const wm = new WeakMap<object, string>();
let key: object | null = { id: 1 };
wm.set(key, "valor");
const alias = key;
key = null;
(globalThis as any).gc();
console.log(wm.has(alias));
```

**2.** Quando o callback de finalização roda?

```ts
const registry = new FinalizationRegistry((v) => console.log("coletado", v));
(function () {
  registry.register({}, "A");
})();
(globalThis as any).gc();
console.log("depois do gc");
await new Promise((r) => setTimeout(r, 0));
console.log("fim");
```

**3.** Closures compartilham o contexto

```ts
function create() {
  const huge = new Array(1_000_000).fill(0);
  const small = 42;
  const useHuge = () => huge.length;
  return () => small;
}
const getSmall = create();
// `huge` pode ser coletado enquanto `getSmall` existir?
```

**4.** `heapUsed` e `ArrayBuffer`

```ts
(globalThis as any).gc();
const before = Deno.memoryUsage();
const buf = new Uint8Array(50_000_000);
const after = Deno.memoryUsage();
console.log(
  Math.round((after.heapUsed - before.heapUsed) / 1e6),
  Math.round((after.external - before.external) / 1e6),
  buf.length > 0,
);
```

<details><summary>Resposta</summary>

1. `true` — `alias` ainda aponta para o objeto, então ele é alcançável e a
   entrada continua lá. Zerar uma variável não libera nada se outra referência
   existir.
2. `depois do gc` sempre sai antes de `coletado A` — o callback nunca roda
   sincronamente; ele é agendado numa task posterior. A posição de `coletado A`
   em relação a `fim` depende do motor, e o spec nem garante que ele rode.
3. **Não** (no V8) — todas as closures criadas na mesma função compartilham um
   único objeto de contexto. Como `useHuge` referencia `huge`, ele entra no
   contexto, e `getSmall` mantém o contexto inteiro vivo. É uma fonte sutil de
   vazamento.
4. Algo como `0 50 true` — o conteúdo de `ArrayBuffer` fica **fora** do heap do
   V8 e aparece em `external`, não em `heapUsed`. Por isso o `index.ts` usa
   arrays de números como payload.

</details>

## ⚙️ Como rodar

```bash
deno task dev
```

Enquanto as funções não estiverem implementadas, termina com `Not implemented`.
Os números de heap variam entre execuções — procure a **ordem de grandeza** (MB
vs perto de zero), não valores exatos.

## 🚀 Desafio extra

1. Crie um vazamento proposital num servidor `Deno.serve` (um array global que
   guarda cada `Request`), faça 10 mil requisições com um script e encontre o
   vazamento pela visão _Comparison_ + _Retainers_ do heap snapshot.
2. Escreva `trackLeaks(label)` que chama `measureHeap` em loop (a cada N
   operações) e avisa se o heap cresce em todas as últimas K medições.
3. Adicione ao `createWeakRefCache` uma camada de referências **fortes** para os
   N itens mais recentes (um mini LRU), para que os itens quentes não sejam
   coletados — é o padrão de cache "soft" usado em alguns runtimes.

## 📚 Referências

- [MDN — Memory management](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Memory_management)
- [javascript.info — Garbage collection](https://javascript.info/garbage-collection)
  e
  [WeakRef and FinalizationRegistry](https://javascript.info/weakref-finalizationregistry)
- [V8 blog — Trash talk: the Orinoco garbage collector](https://v8.dev/blog/trash-talk)
- [V8 blog — WeakRefs and FinalizationRegistry](https://v8.dev/features/weak-references)
- [Chrome DevTools — Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems)
