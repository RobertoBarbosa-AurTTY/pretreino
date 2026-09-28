# Fundamentos 05: Protótipos

**Dificuldade:** ⭐⭐

## 🎯 Objetivo

Entender a **cadeia de protótipos**, o mecanismo real de herança do JavaScript.
Você vai reimplementar `Object.create`, `instanceof` e `new`, montar herança sem
`class` e depois construir a mesma hierarquia com `class` — para ver que `class`
é (quase só) açúcar sintático.

## 🧠 Por que isso importa

- Nos desafios **18** (error handling) e **35** (resilience patterns) você cria
  erros customizados (`class NotFoundError extends Error`). Saber como
  `instanceof` percorre a cadeia explica por que `error instanceof AppError`
  funciona para todas as subclasses — e por que às vezes falha entre realms ou
  quando o prototype é trocado.
- Os desafios **31** (microserviços) e **36** (API gateway) serializam objetos
  com JSON: métodos do prototype **não** vão junto, e um objeto que volta do
  `JSON.parse` não é mais `instanceof` a sua classe.
- No desafio **30** (segurança de API), vale se proteger de **prototype
  pollution**: um `merge` ingênuo com `{"__proto__": {...}}` vindo do body
  altera `Object.prototype` do servidor inteiro.
- Entender property lookup explica por que `Object.hasOwn(obj, k)` é mais seguro
  que `k in obj` ao validar payloads (desafios **17** e **42**).

## 📖 Conceito

### Todo objeto tem um link escondido: `[[Prototype]]`

Quando você lê `obj.x` e `obj` não tem `x` **próprio**, o motor procura em
`Object.getPrototypeOf(obj)`, depois no prototype dele, e assim por diante até
chegar em `null`. Isso é a **cadeia de protótipos**. Escrita (`obj.x = 1`)
normalmente cria a propriedade no **próprio** objeto (não altera o prototype).

```
rex ──► Dog.prototype ──► Animal.prototype ──► Object.prototype ──► null
 name       speak()          describe()          toString()
 breed      fetch()          speak()             hasOwnProperty()
```

`rex.describe()` → não está em `rex`, não está em `Dog.prototype`, achou em
`Animal.prototype`. `rex.speak()` → acha primeiro em `Dog.prototype`
(**shadowing**: o de `Animal` nunca é alcançado).

### `__proto__` vs `prototype` — a confusão clássica

| Nome                         | Existe em                    | O que é                                                                          |
| ---------------------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| `obj.__proto__`              | todo objeto (getter legado)  | o `[[Prototype]]` **deste** objeto                                               |
| `Object.getPrototypeOf(obj)` | —                            | a forma moderna de ler o mesmo link                                              |
| `Fn.prototype`               | funções construtoras/classes | o objeto que vai virar `[[Prototype]]` das **instâncias** criadas com `new Fn()` |

Ou seja: `new Dog().__proto__ === Dog.prototype`. A propriedade `prototype` da
função **não** é o prototype da função (esse é `Function.prototype`).

### O que `new` faz

`new Fn(a, b)` executa, em resumo:

1. Cria um objeto vazio cujo `[[Prototype]]` é `Fn.prototype`.
2. Chama `Fn` com `this` apontando para esse objeto.
3. Se `Fn` retornar um **objeto**, esse é o resultado; senão, o resultado é o
   objeto criado no passo 1.

### O que `instanceof` faz

`obj instanceof Fn` pergunta: "`Fn.prototype` aparece em algum ponto da cadeia
de `obj`?". Não tem nada a ver com qual função **criou** o objeto.

```ts
function A() {}
const a = new (A as any)();
A.prototype = {}; // troca o prototype depois
a instanceof A; // false! a cadeia de `a` aponta para o objeto antigo
```

### `class` por baixo dos panos

```ts
class Dog extends Animal {
  fetch() {}
}
```

cria uma função `Dog`, põe `fetch` em `Dog.prototype`, liga
`Dog.prototype.[[Prototype]]` a `Animal.prototype` **e** liga `Dog` a `Animal`
(por isso métodos `static` são herdados). As diferenças reais: classes não podem
ser chamadas sem `new`, o corpo é sempre strict, métodos não são enumeráveis, e
`super`/campos privados `#x` não têm equivalente direto em funções.

## ✍️ Exercícios

Arquivo: `src/prototypes.ts`

**Parte 1: as primitivas**

- [ ] `createObject(proto, props?)` retorna um objeto cujo prototype é `proto`
      (`null` incluído) e que tem as propriedades de `props` como **próprias**;
      **não use** `Object.create` (dica: uma função vazia `F` com
      `F.prototype = proto`; para `null` é permitido `Object.setPrototypeOf`)
- [ ] `myInstanceOf(obj, Ctor)` percorre a cadeia com `Object.getPrototypeOf`
      comparando com `Ctor.prototype`; primitivos e `null`/`undefined` retornam
      `false`; **não use** `instanceof` nem `isPrototypeOf`
- [ ] `myNew(Ctor, ...args)` segue os 3 passos do `new` (prototype correto,
      `this` ligado, objeto retornado pelo construtor vence, primitivo retornado
      é ignorado); **não use** `new` nem `Reflect.construct`
- [ ] `inherit(Child, Parent)` faz
      `Object.getPrototypeOf(Child.prototype) ===
      Parent.prototype`,
      mantém `Child.prototype.constructor === Child` (não enumerável) e faz
      estáticos de `Parent` acessíveis em `Child`
- [ ] `getPrototypeChain(obj)` retorna o `constructor.name` de cada objeto da
      cadeia, começando pelo prototype de `obj` e terminando em `"Object"`
- [ ] `findPropertyOwner(obj, key)` retorna o objeto da cadeia (incluindo o
      próprio `obj`) que tem `key` como propriedade **própria**, ou `null`

**Parte 2a: com funções construtoras**

- [ ] `Animal(name)` define `this.name`; `speak` e `describe` ficam em
      `Animal.prototype` (nunca na instância)
- [ ] `speak()` retorna `"<name> faz um som."`
- [ ] `describe()` retorna `"<name> (<nome do construtor>)"` — para um `Dog`,
      `"Rex (Dog)"` (sem sobrescrever `describe` em `Dog`)
- [ ] `Dog(name, breed)` **reusa** `Animal` para definir `name` e define
      `this.breed`
- [ ] `inherit(Dog, Animal)` é chamado no ponto marcado, **antes** dos métodos
      de `Dog.prototype`
- [ ] `Dog.prototype.speak()` retorna `"<name> late: au au!"`; `fetch()` retorna
      `"<name> (<breed>) buscou a bolinha."`
- [ ] `Object.keys(rex)` é exatamente `["name", "breed"]`

**Parte 2b: com `class`**

- [ ] `AnimalClass` e `DogClass` seguem **os mesmos contratos** acima
- [ ] `static create(name)` usa `this` (não `AnimalClass` fixo), então
      `DogClass.create("Toto").describe()` retorna `"Toto (DogClass)"`
- [ ] Deixe um comentário listando as diferenças que você percebeu entre as duas
      versões

## 🔮 Preveja antes de rodar

**1. Shadowing e escrita**

```ts
const base = { greeting: "oi", list: [] as string[] };
const child = Object.create(base);
child.greeting = "olá";
child.list.push("x");
console.log(base.greeting, child.greeting, base.list);
console.log(Object.hasOwn(child, "greeting"), Object.hasOwn(child, "list"));
```

<details><summary>Resposta</summary>

`oi olá [ "x" ]` e `true false`. Atribuir `child.greeting` cria uma propriedade
**própria** em `child` (shadowing). Já `child.list.push` **lê** `list` (achada
no prototype) e muta o array compartilhado — por isso nunca se coloca estado
mutável no prototype.

</details>

**2. `prototype` vs `__proto__`**

```ts
function Foo() {}
const f = new (Foo as any)();
console.log(Object.getPrototypeOf(f) === Foo.prototype);
console.log(Object.getPrototypeOf(Foo) === Foo.prototype);
console.log(Object.getPrototypeOf(Foo) === Function.prototype);
console.log(Object.getPrototypeOf(Foo.prototype) === Object.prototype);
```

<details><summary>Resposta</summary>

`true`, `false`, `true`, `true`. `Foo.prototype` é o prototype das
**instâncias**; o prototype da **função** `Foo` é `Function.prototype`; e
`Foo.prototype` é um objeto comum, cujo prototype é `Object.prototype`.

</details>

**3. Adicionando método depois**

```ts
class User {
  constructor(public name: string) {}
}
const u = new User("Ana");
(User.prototype as any).hello = function () {
  return `oi ${this.name}`;
};
console.log((u as any).hello());
```

<details><summary>Resposta</summary>

`oi Ana`. O lookup acontece **na hora da leitura**; como `u` aponta para
`User.prototype` (o mesmo objeto), qualquer método adicionado depois fica
visível para instâncias já criadas.

</details>

## ⚙️ Como rodar

```bash
deno task dev
```

Cada seção imprime `esperado` vs `obtido`. Enquanto uma função não estiver
implementada, a seção mostra `❌ Not implemented`.

## 🚀 Desafio extra

1. Escreva `safeMerge(target, source)` (deep merge) que **não** é vulnerável a
   prototype pollution: teste com `JSON.parse('{"__proto__": {"admin": true}}')`
   e confirme que `({}).admin` continua `undefined`.
2. Faça `myNew` também funcionar com `class` (que não pode ser chamada sem
   `new`) — qual é a única ferramenta da linguagem que permite isso?
3. Implemente `mixin(Target, ...sources)` que copia métodos (com os descritores,
   incluindo getters) de vários prototypes para `Target.prototype`, e discuta
   por que JS não tem herança múltipla.

## 📚 Referências

- [MDN — Herança e cadeia de protótipos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [javascript.info — Prototypes, inheritance](https://javascript.info/prototypes)
- [MDN — Object.create](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [You Don't Know JS — this & Object Prototypes, cap. 5](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/ch5.md)
- [V8 blog — Fast properties / shapes](https://v8.dev/blog/fast-properties)
