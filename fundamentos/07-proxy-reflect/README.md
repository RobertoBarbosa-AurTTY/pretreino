# Fundamentos 07: Proxy e Reflect

**Dificuldade:** ⭐⭐⭐

## 🎯 Objetivo

Aprender a interceptar as **operações fundamentais** de um objeto (ler,
escrever, apagar, `in`, chamar) com `Proxy`, e a delegar o comportamento padrão
com `Reflect`. Com isso você vai construir objetos reativos, somente-leitura,
com valores padrão, validados e "espiões".

## 🧠 Por que isso importa

- **Reatividade:** Vue 3 e MobX são, no fundo, um `reactive()` como o deste
  exercício. No backend, o mesmo truque detecta "o que mudou" num objeto para
  gerar eventos — é a base de um _change log_ no desafio 33 (event sourcing) e
  de notificações no desafio 40 (event driven).
- **Configuração imutável:** congelar a config carregada do `.env` (desafios 12,
  22, 30) evita que um módulo altere sem querer um valor que outro módulo usa.
  `readonly()` faz isso em profundidade, algo que `Object.freeze` não faz.
- **Validação:** o desafio 17 (validação com Zod) e o 42 (request validation)
  validam dados na entrada; `validated()` mostra como validar **em toda
  atribuição**, não só na criação.
- **Observabilidade e testes:** `createLoggingProxy` é o princípio por trás de
  _spies_ e _mocks_ e de tracing automático (desafio 27, logging e
  monitoramento).
- ORMs como Prisma e clientes como o do tRPC usam `Proxy` para criar métodos
  "que não existem" (`db.user.findMany`).

## 📖 Conceito

### Proxy

`new Proxy(target, handler)` cria um objeto que repassa tudo para `target`,
exceto as operações para as quais `handler` define uma **trap**:

| Operação          | Trap                                                |
| ----------------- | --------------------------------------------------- |
| `p.x`             | `get(target, key, receiver)`                        |
| `p.x = v`         | `set(target, key, value, receiver)`                 |
| `delete p.x`      | `deleteProperty(target, key)`                       |
| `"x" in p`        | `has(target, key)`                                  |
| `Object.keys(p)`  | `ownKeys(target)`                                   |
| `p()` / `new p()` | `apply` / `construct` (só quando o target é função) |

```ts
const loud = new Proxy({ msg: "oi" }, {
  get(target, key, receiver) {
    const value = Reflect.get(target, key, receiver);
    return typeof value === "string" ? value.toUpperCase() : value;
  },
});
loud.msg; // "OI"
```

### Reflect

`Reflect` tem **um método para cada trap**, com a mesma assinatura. Ele executa
a operação padrão e devolve o resultado — por isso a regra geral é: _faça o seu
trabalho extra e termine com `return Reflect.<trap>(...arguments)`_.

Por que não `target[key] = value`?

- `Reflect.set` devolve `boolean` (sucesso ou não), exatamente o que a trap
  `set` precisa devolver. Retornar `false` em modo estrito vira `TypeError`.
- O `receiver` garante que **getters/setters** herdados rodem com `this`
  apontando para o proxy, e não para o objeto cru.

### Invariantes

O Proxy não pode "mentir" sobre propriedades não-configuráveis: se `target` tem
uma propriedade congelada, a trap `get` precisa devolver o valor real, senão o
motor lança `TypeError`. É por isso que `readonly()` **não** deve usar
`Object.freeze` no target — o original precisa continuar mutável.

### Profundidade

A trap `get` só intercepta o primeiro nível. Para ser profundo, quando o valor
lido é um objeto, devolva **outro proxy** para ele (com o caminho acumulado).
Guarde os proxies já criados num `WeakMap` para não criar um novo a cada leitura
(e para `state.user === state.user`).

## ✍️ Exercícios

Arquivo: `src/proxy.ts`

- [ ] `reactive(obj, onChange)`
  - [ ] notifica `{ type: "set", path, oldValue, newValue }` em toda atribuição
        e `{ type: "delete", ... }` em todo `delete`
  - [ ] é profundo: `path` contém o caminho completo
        (`["user", "address",
        "city"]`)
  - [ ] não notifica quando `Object.is(oldValue, newValue)`
  - [ ] `state.user === state.user` (cache de proxies)
  - [ ] funciona com arrays (`push` gera um evento para o novo índice)
- [ ] `readonly(obj)`
  - [ ] `set`, `deleteProperty` e `defineProperty` lançam `ReadonlyError` em
        qualquer profundidade
  - [ ] o original continua mutável e as mudanças aparecem na visão
- [ ] `withDefaults(obj, fallback)`
  - [ ] propriedade ausente em `obj` vem de `fallback`
  - [ ] propriedade presente com valor `undefined` **não** usa o fallback
  - [ ] `in` enxerga os dois objetos; escritas vão só para `obj`
- [ ] `validated(obj, schema)`
  - [ ] atribuição inválida lança `ValidationError` e não grava
  - [ ] propriedade sem validador lança `ValidationError`
  - [ ] valores iniciais são validados na criação
- [ ] `createLoggingProxy(obj, log)`
  - [ ] registra `get`, `set`, `delete` e `has` (ignorando chaves `symbol`)
  - [ ] ao chamar um método lido pelo proxy, registra `call` com os argumentos
        **antes** de executá-lo, e executa com `this` = proxy (as leituras
        internas também aparecem no log)

## 🔮 Preveja antes de rodar

**1.** `this` em getter sem `receiver`

```ts
const base = {
  first: "Ana",
  get greeting() {
    return `Olá, ${this.first}`;
  },
};
const p = new Proxy(base, {
  get(target, key) {
    if (key === "first") return "Bia";
    return target[key as keyof typeof target];
  },
});
console.log(p.greeting);
```

**2.** Trap `set` retornando `false`

```ts
"use strict";
const p = new Proxy({}, { set: () => false });
try {
  (p as any).x = 1;
  console.log("ok");
} catch (e) {
  console.log((e as Error).constructor.name);
}
```

**3.** Proxy só intercepta o primeiro nível

```ts
let sets = 0;
const p = new Proxy({ inner: { v: 1 } }, {
  set(t, k, v, r) {
    sets++;
    return Reflect.set(t, k, v, r);
  },
});
p.inner.v = 2;
p.inner = { v: 3 };
console.log(sets);
```

**4.** Proxy e identidade

```ts
const obj = {};
const p = new Proxy(obj, {});
console.log(p === obj, typeof p);
```

<details><summary>Resposta</summary>

1. `Olá, Ana` — `target[key]` executa o getter com `this = target`, que ignora o
   proxy. Com `Reflect.get(target, key, receiver)` o resultado seria `Olá, Bia`.
2. `TypeError` — em módulos (sempre estritos) uma trap `set` que devolve `false`
   faz a atribuição lançar.
3. `1` — `p.inner.v = 2` faz um **get** de `inner` no proxy e um set no objeto
   cru; só `p.inner = ...` passa pela trap `set`.
4. `false object` — o proxy é outro objeto, com identidade própria.

</details>

## ⚙️ Como rodar

```bash
deno task dev
```

O `src/index.ts` imprime esperado vs obtido para cada função; enquanto nada
estiver implementado, termina com `Not implemented`.

## 🚀 Desafio extra

1. Faça `reactive` agrupar mudanças: várias atribuições no mesmo tick geram uma
   única chamada a `onChange` com a lista de eventos (use `queueMicrotask`).
2. Implemente `computed(fn)` em cima do `reactive`: rastreie quais propriedades
   `fn` leu (trap `get`) e recalcule só quando uma delas mudar.
3. Crie `createApiClient(baseUrl)` em que `api.clientes.get(1)` vira
   `GET {baseUrl}/api/clientes/1` — sem declarar nenhuma rota (dica: um proxy
   sobre uma função, usando `get` e `apply`).

## 📚 Referências

- [MDN — Proxy](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN — Reflect](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [javascript.info — Proxy and Reflect](https://javascript.info/proxy)
- [ECMAScript spec — Proxy Object Internal Methods](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)
- [V8 blog — Optimizing ES2015 proxies in V8](https://v8.dev/blog/optimizing-proxies)
