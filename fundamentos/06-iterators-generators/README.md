# Fundamentos 06: Iterators e Generators

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Entender o **protocolo de iteração** do JavaScript (`Symbol.iterator`, `next()`,
`{ value, done }`) e usar **generator functions** (`function*`) e **async
generators** (`async function*`) para construir pipelines preguiçosos (lazy) e
percorrer APIs paginadas item a item.

## 🧠 Por que isso importa

- `for...of`, spread (`[...x]`), `Array.from`, desestruturação,
  `new Map(iterable)` e `Promise.all(iterable)` usam o protocolo de iteração por
  baixo dos panos. Entender o protocolo explica por que um `Map` "funciona" no
  `for...of` e um objeto literal não.
- **Paginação:** o desafio 01 (integração com a API de clientes) e o desafio 28
  (integração com API externa) consomem listas vindas de HTTP. Um
  `async function*` que busca página por página deixa o chamador escrever um
  simples `for await` sem se preocupar com `nextPage`.
- **Processamento em lote:** no desafio 04 (importação de CSV) e no desafio 29
  (processamento assíncrono) é comum ler milhares de linhas e processá-las em
  grupos (`chunk`) sem carregar tudo na memória.
- **Streams:** `ReadableStream` do Deno/Web é async-iterável
  (`for await (const chunk of file.readable)`), e o desafio 14 (upload de
  arquivos) e o 41 (compressão) lidam com streams.

## 📖 Conceito

### O protocolo

Um objeto é **iterável** quando tem um método `[Symbol.iterator]()` que devolve
um **iterador**. Um iterador é qualquer objeto com `next()` que devolve
`{ value, done }`.

```ts
const letters = {
  [Symbol.iterator]() {
    const data = ["a", "b"];
    let i = 0;
    return {
      next: () =>
        i < data.length
          ? { value: data[i++], done: false }
          : { value: undefined, done: true },
    };
  },
};
console.log([...letters]); // ["a", "b"]
```

> **Iterável ≠ iterador.** Um array é iterável (pode ser percorrido várias
> vezes); o iterador que ele devolve é de uso único. Um objeto gerador é as duas
> coisas ao mesmo tempo — e por isso só pode ser percorrido **uma vez**.

### Generators

Uma `function*` devolve um objeto gerador. O corpo **pausa** em cada `yield` e
só continua quando alguém chama `next()` de novo:

```ts
function* hello() {
  console.log("começou");
  yield 1;
  console.log("voltou");
  yield 2;
}
const g = hello(); // nada foi impresso ainda!
g.next(); // "começou" → { value: 1, done: false }
g.next(); // "voltou"  → { value: 2, done: false }
g.next(); //           → { value: undefined, done: true }
```

- `yield* outroIteravel` delega para outro iterável.
- `return()` do iterador é chamado quando o consumidor dá `break` num `for...of`
  — isso executa os blocos `finally` do gerador (ótimo para liberar recursos).

### Lazy vs eager

`array.map().filter().slice(0, 3)` cria **arrays intermediários inteiros**. Com
generators, cada item atravessa o pipeline inteiro antes do próximo começar, e
nada é calculado além do necessário — dá até para trabalhar com sequências
infinitas.

### Async iteration

`async function*` devolve um **async iterator**: `next()` retorna uma
`Promise<{ value, done }>`. Consome-se com `for await...of`. Dentro dele você
pode usar `await` e `yield` livremente.

```ts
async function* ticks() {
  for (let i = 0; i < 3; i++) {
    await new Promise((r) => setTimeout(r, 100));
    yield i;
  }
}
for await (const t of ticks()) console.log(t);
```

## ✍️ Exercícios

Arquivo: `src/iterators.ts`

- [ ] `range(start, end, step = 1)` devolve um **iterável** (implemente
      `[Symbol.iterator]`), `end` exclusivo
  - [ ] Suporta `step` negativo (`range(5, 0, -1)` → `5,4,3,2,1`)
  - [ ] `step === 0` lança `RangeError`
  - [ ] Pode ser percorrido várias vezes (cada `for...of` recomeça)
- [ ] `take(iterable, n)` entrega no máximo `n` itens e **não puxa** o item
      `n + 1` (funciona com iteráveis infinitos); `n <= 0` não entrega nada
- [ ] `map(iterable, fn)` e `filter(iterable, predicate)` são preguiçosos e
      passam `(item, index)` para o callback
- [ ] `chunk(iterable, size)` agrupa em arrays de `size` (o último pode ser
      menor, e nunca entrega array vazio); `size < 1` lança `RangeError`
- [ ] `paginate(fetchPage)` é um `async function*` que:
  - [ ] começa na página 1 e segue `nextPage` até ser `null`
  - [ ] entrega os itens **um a um** (não páginas)
  - [ ] só busca a próxima página quando a atual acabar — um `break` no
        consumidor impede novas buscas
  - [ ] deixa erros de `fetchPage` chegarem ao `for await` do chamador

## 🔮 Preveja antes de rodar

Anote a saída de cada trecho **antes** de executá-lo.

**1.** Gerador de uso único

```ts
function* abc() {
  yield "a";
  yield "b";
}
const g = abc();
console.log([...g]);
console.log([...g]);
```

**2.** Ordem de execução com lazy

```ts
function* nums() {
  console.log("gerando 1");
  yield 1;
  console.log("gerando 2");
  yield 2;
}
for (const n of nums()) {
  console.log("usando", n);
  break;
}
console.log("fim");
```

**3.** `finally` no `break`

```ts
function* withCleanup() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log("limpando");
  }
}
for (const n of withCleanup()) {
  console.log(n);
  break;
}
```

**4.** Objeto literal no `for...of`

```ts
const obj = { a: 1, b: 2 };
try {
  for (const x of obj as any) console.log(x);
} catch (e) {
  console.log((e as Error).constructor.name);
}
```

<details><summary>Resposta</summary>

1. `["a", "b"]` e depois `[]` — o gerador já foi esgotado; ele é seu próprio
   iterador.
2. `gerando 1`, `usando 1`, `fim` — o `break` encerra o gerador antes de
   `"gerando 2"` rodar.
3. `1` e depois `limpando` — o `break` chama `return()` no gerador, que executa
   o `finally`.
4. `TypeError` — objetos literais não têm `[Symbol.iterator]`. Use
   `Object.entries(obj)`.

</details>

## ⚙️ Como rodar

```bash
deno task dev
```

O `src/index.ts` imprime o valor esperado ao lado do obtido. Enquanto as funções
não estiverem implementadas, ele termina com `Not implemented`.

## 🚀 Desafio extra

1. Troque o `fakeFetchPage` do `index.ts` por uma chamada real à mock API
   (`GET /api/clientes`, veja `API.md` na raiz — é preciso fazer login antes e
   adicionar `--allow-net` à task). Como a rota não é paginada, simule a
   paginação fatiando a resposta, ou crie um adaptador que transforme a lista
   num `Page<T>`.
2. Escreva versões assíncronas: `mapAsync`, `filterAsync`, `takeAsync` sobre
   `AsyncIterable<T>`, e um `chunkAsync` para processar os clientes de 10 em 10.
3. Implemente `zip(a, b)` e `pipe(iterable, ...ops)` — e garanta que `zip` chama
   `return()` no iterador que sobrou quando o outro termina.

## 📚 Referências

- [MDN — Iteration protocols](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Iteration_protocols)
- [javascript.info — Generators](https://javascript.info/generators) e
  [Async iteration and generators](https://javascript.info/async-iterators-generators)
- [You Don't Know JS Yet — Get Started (Iteration)](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch3.md)
- [ECMAScript spec — Iteration](https://tc39.es/ecma262/#sec-iteration)
