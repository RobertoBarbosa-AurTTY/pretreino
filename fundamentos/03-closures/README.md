# Fundamentos 03: Closures

**Dificuldade:** ⭐

## 🎯 Objetivo

Entender **escopo léxico** e **closures**: uma função "lembra" as variáveis do
lugar onde foi **criada**, mesmo depois que esse escopo terminou. Você vai usar
isso para construir utilitários clássicos (`once`, `memoize`, `debounce`,
`throttle`, `curry`) e estado privado sem classes.

## 🧠 Por que isso importa

- O desafio **08** (cache de API externa) e o **43** (response caching) são, no
  fundo, um `memoize` com TTL: o `Map` do cache vive dentro de uma closure.
- O desafio **15** (rate limiting) guarda contadores por cliente em estado
  privado — o mesmo padrão do `createCounter`.
- O desafio **19** (middleware chain) é uma pilha de closures: cada middleware
  captura o `next` do seguinte.
- O desafio **13** (SQLite) e o **23** (Redis) usam `once` para abrir a conexão
  uma única vez, mesmo com várias chamadas concorrentes.
- `debounce`/`throttle` aparecem no desafio **47** (search engine /
  autocomplete) e no **16** (WebSocket), para não inundar o servidor.

## 📖 Conceito

### Escopo léxico

O escopo de uma variável é decidido pelo lugar em que ela está **escrita** no
código, não por onde a função é chamada.

```ts
const name = "global";
function outer() {
  const name = "outer";
  return function inner() {
    return name; // procura primeiro em inner, depois em outer, depois global
  };
}
const fn = outer(); // outer já terminou...
fn(); // ...mas "outer" continua acessível: isso é uma closure
```

Toda função em JS carrega uma referência ao **ambiente** (as variáveis) onde foi
criada. Enquanto a função existir, esse ambiente não é coletado pelo GC.

### Estado privado

Variáveis de uma closure não são propriedades: não aparecem em `Object.keys`,
não podem ser alteradas de fora. É o "private" original do JS, antes de
`#campos` em classes.

```ts
function makeSecret(value: string) {
  return { reveal: () => value }; // `value` não é acessível de outra forma
}
```

### O bug clássico do `var` no loop

`var` tem escopo de **função**, não de bloco. Todas as closures criadas no loop
compartilham **a mesma** variável `i`, e quando elas rodam o loop já terminou.

```ts
var fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
fns.map((f) => f()); // [3, 3, 3] 😱
```

Com `let`, cada iteração ganha uma **nova** ligação de `i`. Antes do `let`, a
correção era criar um escopo novo por iteração com uma IIFE. No exercício
`makeCallbacks`, resolva **das duas formas** (deixe uma comentada).

### Closures e timers

`debounce` e `throttle` guardam na closure o ID do timer e os últimos
argumentos. É isso que permite que chamadas diferentes "conversem" entre si sem
nenhuma variável global.

- **debounce**: "espere o usuário parar de digitar" — só executa depois de
  `waitMs` sem chamadas.
- **throttle**: "no máximo uma vez a cada `intervalMs`" — executa logo, e agrupa
  as chamadas seguintes do intervalo.

## ✍️ Exercícios

Arquivo: `src/closures.ts` — todo estado deve ficar em closures (nada de
variáveis no nível do módulo, nada de `class`).

- [ ] `once(fn)` chama `fn` só na primeira vez (repassando os argumentos) e
      retorna o **mesmo resultado** nas chamadas seguintes, sem chamar `fn` de
      novo
- [ ] `memoize(fn)` guarda resultados em um `Map`; por padrão a chave é o
      **primeiro argumento**
- [ ] `memoize(fn, { resolver })` usa `resolver(...args)` como chave
- [ ] `memoized.cache` expõe o `Map`; `memoized.clear()` o esvazia
- [ ] `memoize` guarda também resultados "falsy" (`0`, `""`, `undefined`) — use
      `cache.has`, não `if (cache.get(k))`
- [ ] `debounce(fn, waitMs)` só chama `fn` depois de `waitMs` sem novas
      chamadas, com os argumentos da **última** chamada
- [ ] `debounced.cancel()` descarta a chamada pendente
- [ ] `throttle(fn, intervalMs)` executa a primeira chamada **imediatamente**
      (leading); chamadas dentro do intervalo viram **uma** chamada no fim do
      intervalo (trailing) com os argumentos mais recentes; depois do intervalo
      livre, a próxima chamada volta a ser imediata
- [ ] `throttled.cancel()` descarta a chamada trailing pendente
- [ ] `createCounter(initial = 0, step = 1)` retorna
      `{ increment, decrement, reset, value }`; `increment`/`decrement` somam ou
      subtraem `step` e retornam o novo valor; `reset` volta ao `initial`; o
      valor **não** é acessível como propriedade
- [ ] `makeCallbacks(n)` retorna `n` funções onde a `i`-ésima retorna `i`
- [ ] `curry(fn)` transforma `fn(a, b, c)` em `fn(a)(b)(c)` usando `fn.length`;
      aplicações parciais podem ser reutilizadas
      (`const f = c(1); f(2)(3);
      f(5)(6)`)

## 🔮 Preveja antes de rodar

**1. Qual `x`?**

```ts
let x = "global";
function printX() {
  console.log(x);
}
function run() {
  let x = "local";
  printX();
}
run();
```

<details><summary>Resposta</summary>

`global`. `printX` foi **escrita** no escopo global, então enxerga o `x` global.
Não importa que ela foi **chamada** de dentro de `run` (isso seria escopo
dinâmico, que o JS não tem).

</details>

**2. `var` + `setTimeout`**

```ts
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var", i), 0);
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let", j), 0);
}
```

<details><summary>Resposta</summary>

`var 3`, `var 3`, `var 3`, `let 0`, `let 1`, `let 2`. Os timers rodam depois do
loop terminar; com `var` só existe um `i` (que vale 3), com `let` existe um `j`
por iteração.

</details>

**3. Closures compartilhando o mesmo ambiente**

```ts
function make() {
  let n = 0;
  return { inc: () => ++n, get: () => n };
}
const a = make();
const b = make();
a.inc();
a.inc();
b.inc();
console.log(a.get(), b.get());
```

<details><summary>Resposta</summary>

`2 1`. `inc` e `get` de `a` compartilham o **mesmo** `n`; cada chamada de
`make()` cria um ambiente novo, então `b` tem o seu próprio `n`.

</details>

## ⚙️ Como rodar

```bash
deno task dev
```

Cada seção imprime `esperado` vs `obtido`. Enquanto uma função não estiver
implementada, a seção mostra `❌ Not implemented`.

## 🚀 Desafio extra

1. `memoize` com TTL e limite de tamanho (`{ ttlMs, maxSize }`), removendo a
   entrada mais antiga quando encher — é praticamente o desafio **08**.
2. `memoizeAsync(fn)` que deduplica chamadas **concorrentes**: duas chamadas com
   a mesma chave enquanto a primeira ainda está pendente devem receber a **mesma
   Promise**; se ela rejeitar, a chave sai do cache.
3. Faça `curry` aceitar vários argumentos por vez (`c(1, 2)(3)` e `c(1)(2, 3)`)
   e escreva o tipo TypeScript para isso.

## 📚 Referências

- [MDN — Closures](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Closures)
- [javascript.info — Variable scope, closure](https://javascript.info/closure)
- [javascript.info — Decorators and forwarding (debounce/throttle)](https://javascript.info/call-apply-decorators)
- [You Don't Know JS Yet — Scope & Closures](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures)
