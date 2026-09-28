# Fundamentos 04: `this`, `call`, `apply` e `bind`

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Entender **como o valor de `this` é decidido** (na chamada, não na definição),
reimplementar `call`, `apply` e `bind` do zero e corrigir os bugs de "`this`
perdido" que aparecem quando métodos de classe viram callbacks.

## 🧠 Por que isso importa

- Nos desafios **20** (API REST completa) e **19** (middleware chain), é comum
  registrar `router.get("/x", controller.list)`: o método perde o `this` e
  explode com `Cannot read properties of undefined`.
- Nos desafios **21** (job scheduler), **48** (task scheduler) e **49** (API
  monitoring), passar `this.run` para `setInterval` é o bug clássico: o timer
  roda, mas o estado da instância nunca muda.
- Nos desafios **16** (WebSocket) e **40** (event-driven), handlers de evento
  são métodos registrados como callbacks — mesmo problema.
- `bind` com argumentos parciais é a forma mais simples de "configurar" uma
  função (ex.: um logger com prefixo fixo, desafio **27**).

## 📖 Conceito

### As 4 regras (em ordem de prioridade)

O `this` de uma função **normal** é decidido no momento da **chamada**:

| Forma da chamada                  | `this` é...                                        |
| --------------------------------- | -------------------------------------------------- |
| `new Fn()`                        | o objeto novo                                      |
| `fn.call(obj)` / `apply` / `bind` | `obj` (explícito)                                  |
| `obj.fn()`                        | `obj` (o que está **antes do ponto**)              |
| `fn()`                            | `undefined` em strict mode (módulos ES são strict) |

**Arrow functions** não têm `this` próprio: usam o `this` do escopo onde foram
**escritas** (escopo léxico, como qualquer variável). Por isso `call`/`bind` não
mudam o `this` de uma arrow.

### Como o `this` se perde

```ts
const user = {
  name: "Ana",
  hi() {
    return this.name;
  },
};
user.hi(); // "Ana" — tem objeto antes do ponto
const fn = user.hi;
fn(); // TypeError — chamada "solta", this === undefined
```

Passar `user.hi` como callback (`setTimeout(user.hi)`, `arr.map(user.hi)`,
`app.get("/", user.hi)`) é exatamente o `const fn = user.hi` acima: quem chama
depois não sabe de onde a função veio. No Deno, callbacks de `setInterval` nem
recebem a instância como `this` — o código roda, mas altera o objeto errado.

### Três formas de corrigir

```ts
// 1. Arrow function no ponto da chamada
setTimeout(() => this.tick(), 1000);

// 2. bind no ponto da chamada (ou no construtor)
setTimeout(this.tick.bind(this), 1000);

// 3. Campo de classe com arrow (cada instância ganha sua própria função)
class X {
  tick = () => {/* this sempre é a instância */};
}
```

A opção 3 é prática, mas cria uma função **por instância** e o método não fica
no prototype (não dá para sobrescrever com `super.tick()` numa subclasse).

### Como `call` funciona por dentro

A regra "`obj.fn()` → `this` é `obj`" é a chave: para chamar `fn` com um `this`
qualquer sem usar `call`, basta **pendurar** `fn` temporariamente em `obj` e
chamar como método. Use uma chave `Symbol` para não colidir com propriedades
existentes, e remova depois (mesmo se `fn` lançar).

## ✍️ Exercícios

Arquivo: `src/this.ts` — na parte 1 **não use** `Function.prototype.call`,
`.apply`, `.bind` nem `Reflect.apply`.

**Parte 1: reimplementando**

- [ ] `myCall(fn, thisArg, ...args)` chama `fn` com `this === thisArg` e retorna
      o resultado
- [ ] `myCall` com `thisArg` `null`/`undefined` usa `globalThis` (é o
      comportamento do modo não estrito; o `call` nativo em strict mode passaria
      `null` mesmo — a emulação não consegue, e tudo bem)
- [ ] `myCall` com primitivo (`42`, `"x"`) usa o objeto encaixotado
      (`Object(42)`)
- [ ] `myCall` não deixa nenhuma propriedade nova no `thisArg`, nem quando `fn`
      lança
- [ ] `myApply(fn, thisArg, args?)` igual ao `myCall`, com os argumentos em
      array (ou nenhum)
- [ ] `myBind(fn, thisArg, ...boundArgs)` retorna uma função que sempre chama
      `fn` com `this === thisArg` e com `boundArgs` **antes** dos argumentos
      recebidos
- [ ] Chamar a função retornada por `myBind` como método de outro objeto **não**
      muda o `this`; fazer `myBind` de uma função já "bindada" também não
- [ ] `bindAll(obj, names)` substitui cada método listado por uma versão
      "bindada" a `obj` (no próprio objeto) e retorna `obj`

**Parte 2: corrigindo bugs**

- [ ] `ReportFormatter.formatAll` retorna cada linha com o prefixo (hoje lança
      `TypeError`)
- [ ] `HeartbeatMonitor.start(ms)` faz `count` crescer a cada intervalo e
      `stop()` interrompe (hoje `count` fica em `0`)
- [ ] Corrija cada classe com uma técnica **diferente** e escreva num comentário
      a vantagem/desvantagem da escolhida

## 🔮 Preveja antes de rodar

**1. Método "arrancado"**

```ts
const counter = {
  n: 0,
  inc() {
    this.n++;
    return this.n;
  },
};
const inc = counter.inc;
console.log(counter.inc());
try {
  console.log(inc());
} catch (e) {
  console.log("erro:", (e as Error).constructor.name);
}
```

<details><summary>Resposta</summary>

`1` e depois `erro: TypeError`. A segunda chamada é "solta": em um módulo
(strict mode) `this` é `undefined`, e `undefined.n` lança.

</details>

**2. Arrow vs function dentro de um método**

```ts
const obj = {
  name: "obj",
  regular() {
    return [1].map(function () {
      return typeof this;
    });
  },
  arrow() {
    return [1].map(() => this.name);
  },
};
console.log(obj.regular(), obj.arrow());
```

<details><summary>Resposta</summary>

`[ "undefined" ] [ "obj" ]`. A `function` passada ao `map` é chamada solta
(`this` indefinido); a arrow herda o `this` de `arrow()`, que foi chamado como
`obj.arrow()`.

</details>

**3. `bind` é para sempre**

```ts
function who(this: { id: string }) {
  return this.id;
}
const a = who.bind({ id: "A" });
const b = a.bind({ id: "B" });
const holder = { id: "C", who: a };
console.log(a(), b(), holder.who(), a.call({ id: "D" }));
```

<details><summary>Resposta</summary>

`A A A A`. Uma função "bindada" ignora qualquer outro `this` — seja um segundo
`bind`, uma chamada como método ou `call`. Só `new` consegue sobrescrever (veja
o desafio extra).

</details>

## ⚙️ Como rodar

```bash
deno task dev
```

Cada seção imprime `esperado` vs `obtido`. Enquanto uma função não estiver
implementada, a seção mostra `❌ Not implemented`; as classes da parte 2 mostram
o comportamento bugado até você corrigir.

## 🚀 Desafio extra

1. Faça `myBind` funcionar com `new`: `new (myBind(Point, null, 1))(2)` deve
   criar um `Point` com `x = 1, y = 2`, ignorar o `thisArg` e fazer
   `instanceof Point` dar `true` (dica: `new.target`).
2. Faça a função retornada por `myBind` ter `name === "bound " + fn.name` e
   `length === max(0, fn.length - boundArgs.length)`, como a nativa.
3. Escreva um decorator de método `@autobind` (TypeScript 5 decorators) que faz
   o bind automaticamente na primeira leitura do método.

## 📚 Referências

- [MDN — this](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/this)
- [MDN — Function.prototype.bind](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [javascript.info — Function binding](https://javascript.info/bind)
- [javascript.info — Decorators and forwarding, call/apply](https://javascript.info/call-apply-decorators)
- [You Don't Know JS — this & Object Prototypes, cap. 2](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/ch2.md)
