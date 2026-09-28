/**
 * Fundamentos 05: Prototypes — playground
 *
 * Run with `deno task dev` and compare "esperado" vs "obtido" by eye.
 */

import {
  Animal,
  AnimalClass,
  type AnimalInstance,
  createObject,
  Dog,
  DogClass,
  type DogInstance,
  findPropertyOwner,
  getPrototypeChain,
  inherit,
  myInstanceOf,
  myNew,
} from "./prototypes.ts";

let failures = 0;

async function section(title: string, fn: () => Promise<void> | void) {
  console.log(`\n=== ${title} ===`);
  try {
    await fn();
  } catch (error) {
    failures++;
    console.log("❌", error instanceof Error ? error.message : error);
  }
}

await section("createObject", () => {
  const base = {
    greet(this: { name: string }) {
      return `oi, ${this.name}`;
    },
  };
  const obj = createObject(base, { name: "Ana" }) as
    & { name: string }
    & typeof base;
  console.log("esperado: oi, Ana | obtido:", obj.greet());
  console.log(
    "esperado: true (proto correto) | obtido:",
    Object.getPrototypeOf(obj) === base,
  );
  console.log(
    "esperado: false (greet não é própria) | obtido:",
    Object.hasOwn(obj, "greet"),
  );
  const bare = createObject(null, { x: 1 });
  console.log(
    "esperado: null (sem prototype, nem toString) | obtido:",
    Object.getPrototypeOf(bare),
  );
});

await section("myInstanceOf", () => {
  class A {}
  class B extends A {}
  const b = new B();
  console.log("esperado: true | obtido:", myInstanceOf(b, B));
  console.log("esperado: true | obtido:", myInstanceOf(b, A));
  console.log("esperado: true | obtido:", myInstanceOf(b, Object));
  console.log("esperado: false | obtido:", myInstanceOf(b, Array));
  console.log(
    "esperado: false (primitivo) | obtido:",
    myInstanceOf(42, Number),
  );
  console.log("esperado: false | obtido:", myInstanceOf(null, Object));
});

await section("myNew", () => {
  interface Point {
    x: number;
    y: number;
  }
  function Point(this: Point, x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  Point.prototype.sum = function (this: Point) {
    return this.x + this.y;
  };
  const p = myNew(Point, 2, 3) as Point & { sum(): number };
  console.log("esperado: 2 3 5 | obtido:", p.x, p.y, p.sum());
  console.log("esperado: true | obtido:", p instanceof Point);

  function ReturnsObject(this: object) {
    return { custom: true };
  }
  console.log(
    "esperado: { custom: true } (objeto retornado vence) | obtido:",
    myNew(ReturnsObject),
  );
  function ReturnsPrimitive(this: { ok: boolean }) {
    this.ok = true;
    return 123;
  }
  console.log(
    "esperado: { ok: true } (primitivo retornado é ignorado) | obtido:",
    myNew(ReturnsPrimitive),
  );
});

await section("inherit", () => {
  function Base(this: { kind: string }) {
    this.kind = "base";
  }
  Base.prototype.hello = () => "hello from Base";
  (Base as unknown as { version: string }).version = "1.0";
  function Child() {}
  inherit(Child, Base);
  const c = Reflect.construct(Child, []) as { hello(): string };
  console.log("esperado: hello from Base | obtido:", c.hello());
  console.log(
    "esperado: true (constructor preservado) | obtido:",
    Child.prototype.constructor === Child,
  );
  console.log(
    "esperado: 1.0 (estático herdado) | obtido:",
    (Child as unknown as { version: string }).version,
  );
});

await section("Animal/Dog com funções construtoras", () => {
  const rex = myNew(Dog, "Rex", "vira-lata") as DogInstance;
  const generic = myNew(Animal, "Bicho") as AnimalInstance;
  console.log("esperado: Bicho faz um som. | obtido:", generic.speak());
  console.log("esperado: Rex late: au au! | obtido:", rex.speak());
  console.log(
    "esperado: Rex (vira-lata) buscou a bolinha. | obtido:",
    rex.fetch(),
  );
  console.log("esperado: Rex (Dog) | obtido:", rex.describe());
  console.log(
    "esperado: true true | obtido:",
    rex instanceof Dog,
    rex instanceof Animal,
  );
  console.log(
    "esperado: [ 'name', 'breed' ] (métodos não são próprios) | obtido:",
    Object.keys(rex),
  );
  console.log(
    "esperado: [ 'Dog', 'Animal', 'Object' ] | obtido:",
    getPrototypeChain(rex),
  );
  console.log(
    "esperado: true (describe mora em Animal.prototype) | obtido:",
    findPropertyOwner(rex, "describe") === Animal.prototype,
  );
  console.log(
    "esperado: true (speak sobrescrito em Dog.prototype) | obtido:",
    findPropertyOwner(rex, "speak") === Dog.prototype,
  );
  console.log(
    "esperado: null | obtido:",
    findPropertyOwner(rex, "voar"),
  );
});

await section("Animal/Dog com class", () => {
  const rex = new DogClass("Rex", "vira-lata");
  console.log("esperado: Rex late: au au! | obtido:", rex.speak());
  console.log("esperado: Rex (DogClass) | obtido:", rex.describe());
  console.log(
    "esperado: [ 'DogClass', 'AnimalClass', 'Object' ] | obtido:",
    getPrototypeChain(rex),
  );
  const created = DogClass.create("Toto");
  console.log(
    "esperado: Toto (DogClass) (static herdado usa this) | obtido:",
    created.describe(),
  );
  console.log(
    "esperado: true (class é açúcar sobre prototype) | obtido:",
    Object.getPrototypeOf(DogClass.prototype) === AnimalClass.prototype,
  );
});

if (failures > 0) {
  console.log(`\n${failures} seção(ões) falharam.`);
  Deno.exitCode = 1;
}
