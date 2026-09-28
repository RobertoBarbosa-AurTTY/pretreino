# Fundamentos 02: Promises do zero

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Implementar a sua própria `MyPromise<T>`, seguindo o essencial da especificação
**Promises/A+**, sem usar a `Promise` nativa. Depois deste exercício, `async`,
`await`, `.then` e `Promise.all` deixam de ser mágica.

## 🧠 Por que isso importa

- Todo I/O dos 50 desafios (fetch, arquivo, banco) passa por Promises. Saber
  **quando** um `.then` roda e **para onde** vai um erro é o que separa um
  `try/catch` que funciona de uma "unhandled rejection" em produção (desafio
  **18**, error handling).
- O desafio **08** (cache de API externa) deduplica requisições guardando a
  **mesma Promise** para chamadas concorrentes — só funciona porque vários
  `.then` na mesma promise recebem o mesmo valor.
- `Promise.all`, `allSettled` e `race` são a base de processamento concorrente
  (desafios **29** e **09**), de timeouts (`race` contra um timer — desafio
  **35**) e de fan-out em gateways (desafio **36**).

## 📖 Conceito

### Uma Promise é uma máquina de estados

```
           resolve(v)             
pending ───────────────► fulfilled (value = v)
   │
   └────────────────────► rejected  (reason = e)
           reject(e)
```

- Começa em `pending`.
- Vai para `fulfilled` **ou** `rejected` **uma única vez**. Depois de assentada
  ("settled"), chamadas extras de `resolve`/`reject` são ignoradas.
- Quem chama `.then` antes de assentar fica numa **fila de callbacks**; quem
  chama depois é agendado imediatamente (mas ainda assim de forma assíncrona).

### `then` sempre retorna uma promise **nova**

```ts
const p2 = p1.then(f, g);
```

O destino de `p2` depende do que acontece dentro de `f` (ou `g`):

| Dentro do handler            | `p2` fica...                           |
| ---------------------------- | -------------------------------------- |
| retorna um valor comum `x`   | fulfilled com `x`                      |
| retorna uma promise/thenable | **adota** o estado dela                |
| lança `e`                    | rejected com `e`                       |
| handler ausente              | copia o estado de `p1` (passa adiante) |

Note que `g` (o handler de rejeição) que **retorna** um valor **recupera** a
cadeia: `p2` fica fulfilled.

### Callbacks são sempre assíncronos

Mesmo que a promise já esteja resolvida, o handler do `.then` roda em uma
**microtask**, nunca na mesma call stack. Isso garante consistência: o código
depois do `.then(...)` sempre roda antes do handler.

```ts
// ilustração do agendamento (não é a solução):
queueMicrotask(() => console.log("roda depois do código síncrono atual"));
```

### Thenables e o "Promise Resolution Procedure"

Quando você resolve com algo que tem um método `then` (uma promise sua, uma
nativa, ou qualquer objeto "thenable"), a promise não é fulfilled **com esse
objeto**: ela **segue** o estado dele. É por isso que `await fetch(...)` dentro
de outra promise funciona. Cuidados da spec:

- Resolver uma promise com **ela mesma** → rejeita com `TypeError` (senão seria
  um ciclo infinito).
- Ler `x.then` pode lançar (getter) → rejeita com o erro.
- O thenable pode chamar seus callbacks várias vezes ou chamar os dois → só a
  **primeira** chamada vale.

### Os métodos estáticos

| Método       | Resolve quando...                      | Rejeita quando...                 |
| ------------ | -------------------------------------- | --------------------------------- |
| `all`        | **todas** resolvem (array na ordem)    | a **primeira** rejeita            |
| `allSettled` | todas assentam (nunca rejeita)         | —                                 |
| `race`       | a primeira **assenta** (qualquer lado) | a primeira assenta rejeitada      |
| `any`        | a primeira **resolve**                 | todas rejeitam (`AggregateError`) |

## ✍️ Exercícios

Arquivo: `src/my-promise.ts` — **não use** `Promise` nativa na implementação
(`queueMicrotask` é permitido).

**Construtor e estado**

- [ ] O `executor` é chamado **de forma síncrona** no construtor, recebendo
      `resolve` e `reject`
- [ ] Se o `executor` lançar, a promise é rejeitada com o erro lançado (se ainda
      estiver `pending`)
- [ ] O getter `state` retorna `"pending"`, `"fulfilled"` ou `"rejected"`
- [ ] Depois de assentada, o estado e o valor/motivo **nunca** mudam (chamadas
      extras de `resolve`/`reject` são ignoradas)

**`then`**

- [ ] Retorna **sempre** uma nova `MyPromise`
- [ ] Handlers rodam **assíncronos** (microtask), mesmo se a promise já estiver
      assentada
- [ ] Vários `then` na mesma promise rodam na ordem em que foram registrados
- [ ] Se `onFulfilled`/`onRejected` não for função, o valor/motivo passa adiante
      para a próxima promise
- [ ] O retorno do handler resolve a próxima promise; um `throw` dentro do
      handler rejeita a próxima promise
- [ ] Um handler de rejeição que retorna normalmente **recupera** a cadeia

**Procedimento de resolução (`resolve(x)`)**

- [ ] Se `x` for a própria promise → rejeita com `TypeError`
- [ ] Se `x` for objeto/função com `then` função → **adota** o estado de `x`
      chamando `x.then(resolve, reject)`; funciona com `MyPromise`, `Promise`
      nativa e thenables quaisquer
- [ ] Se ler `x.then` ou chamá-lo lançar → rejeita (a não ser que já tenha
      resolvido)
- [ ] Só a primeira chamada de `resolvePromise`/`rejectPromise` feita pelo
      thenable conta
- [ ] Caso contrário, fulfilled com `x`

**`catch` e `finally`**

- [ ] `catch(fn)` equivale a `then(undefined, fn)`
- [ ] `finally(fn)` chama `fn` sem argumentos nos dois casos e **repassa** o
      valor/motivo original (o retorno de `fn` é ignorado)
- [ ] Se `fn` lançar (ou retornar promise rejeitada), a promise resultante é
      rejeitada com esse erro; se `fn` retornar uma promise, espera ela antes de
      repassar

**Estáticos**

- [ ] `MyPromise.resolve(v)` — se `v` já for `MyPromise`, retorna ela mesma;
      senão cria uma resolvida com `v` (adotando thenables)
- [ ] `MyPromise.reject(r)` — cria uma promise rejeitada com `r`
- [ ] `MyPromise.all(values)` — aceita valores comuns misturados com promises;
      resolve com os resultados **na ordem da entrada** (não na ordem de
      conclusão); array vazio resolve com `[]`; rejeita na primeira rejeição
- [ ] `MyPromise.race(values)` — assenta igual à primeira que assentar; array
      vazio fica `pending` para sempre
- [ ] `MyPromise.allSettled(values)` — nunca rejeita; resolve com
      `{ status: "fulfilled", value }` / `{ status: "rejected", reason }` na
      ordem da entrada
- [ ] `MyPromise.any(values)` — resolve com o primeiro que resolver; se todos
      rejeitarem (ou array vazio), rejeita com `AggregateError` cujo `errors`
      está na ordem da entrada

## 🔮 Preveja antes de rodar

Esses trechos usam a `Promise` **nativa** — depois de implementar, troque por
`MyPromise` e veja se a ordem se mantém.

**1. Handler de promise já resolvida**

```ts
const p = Promise.resolve("ok");
p.then((v) => console.log("then:", v));
console.log("depois do then");
```

<details><summary>Resposta</summary>

`depois do then` e depois `then: ok`. Handlers são sempre microtasks, mesmo com
a promise já resolvida.

</details>

**2. Para onde vai o erro?**

```ts
Promise.reject(new Error("A"))
  .then(() => console.log("1"))
  .catch((e) => {
    console.log("2", e.message);
    return "B";
  })
  .then((v) => console.log("3", v))
  .catch(() => console.log("4"));
```

<details><summary>Resposta</summary>

`2 A` e depois `3 B`. O primeiro `then` não tem handler de rejeição, então o
erro passa adiante até o `catch`; o `catch` retorna normalmente, o que
**recupera** a cadeia — o último `catch` nunca é chamado.

</details>

**3. Duas cadeias intercaladas**

```ts
Promise.resolve()
  .then(() => console.log("a1"))
  .then(() => console.log("a2"));
Promise.resolve()
  .then(() => console.log("b1"))
  .then(() => console.log("b2"));
```

<details><summary>Resposta</summary>

`a1 b1 a2 b2`. Cada `.then` só é agendado quando o anterior da **mesma** cadeia
termina, então as duas cadeias se intercalam uma microtask por vez.

</details>

**4. `resolve` com uma promise custa "ticks" extras**

```ts
new Promise((resolve) => resolve(Promise.resolve()))
  .then(() => console.log("adotada"));
Promise.resolve()
  .then(() => console.log("t1"))
  .then(() => console.log("t2"))
  .then(() => console.log("t3"));
```

<details><summary>Resposta</summary>

`t1 t2 adotada t3`. Adotar um thenable exige agendar uma microtask para chamar
`thenable.then(...)` e outra para o callback dele rodar, então a promise
"adotada" só resolve dois ticks depois. (É um detalhe da spec do ECMAScript; a
sua implementação pode diferir no número de ticks e ainda seguir Promises/A+.)

</details>

## ⚙️ Como rodar

```bash
deno task dev
```

Cada seção imprime `esperado` vs `obtido`. Enquanto a classe não estiver
implementada, as seções mostram `❌ Not implemented`.

## 🚀 Desafio extra

1. Rode a suíte oficial
   [promises-aplus-tests](https://github.com/promises-aplus/promises-tests)
   contra a sua implementação (ela precisa de um adapter com `deferred()`).
2. Faça `all`/`race`/`allSettled`/`any` aceitarem qualquer `Iterable` (por
   exemplo um `Set` ou um generator), não só arrays.
3. Implemente `MyPromise.withResolvers()` e um `timeout(promise, ms)` que
   rejeita com `TimeoutError` usando `race` — e garanta que o timer é limpo
   quando a promise original termina primeiro.

## 📚 Referências

- [Especificação Promises/A+](https://promisesaplus.com/)
- [MDN — Usando promises](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Using_promises)
- [javascript.info — Promises, async/await](https://javascript.info/async)
- [V8 blog — Faster async functions and promises](https://v8.dev/blog/fast-async)
- [You Don't Know JS — Async & Performance, cap. 3 (Promises)](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md)
