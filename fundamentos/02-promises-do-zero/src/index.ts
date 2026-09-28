/**
 * Fundamentos 02: Promises do zero — playground
 *
 * Run with `deno task dev` and compare "esperado" vs "obtido" by eye.
 * `await` works on MyPromise because it implements PromiseLike (it has `then`).
 */

import { MyPromise } from "./my-promise.ts";

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

const delay = <T>(ms: number, value: T) =>
  new MyPromise<T>((resolve) => setTimeout(() => resolve(value), ms));

await section(
  "executor roda síncrono, callbacks rodam assíncronos",
  async () => {
    const log: string[] = [];
    const p = new MyPromise<number>((resolve) => {
      log.push("executor");
      resolve(1);
    });
    p.then((v) => log.push(`then ${v}`));
    log.push("sync depois do then");
    console.log(
      "esperado: [ 'executor', 'sync depois do then' ] | obtido:",
      [...log],
    );
    await p;
    await null;
    console.log(
      "esperado: [ 'executor', 'sync depois do then', 'then 1' ] | obtido:",
      log,
    );
  },
);

await section("estado imutável depois de assentado", async () => {
  const p = new MyPromise<string>((resolve, reject) => {
    resolve("primeiro");
    resolve("segundo");
    reject(new Error("ignorado"));
  });
  console.log("esperado: primeiro | obtido:", await p);
  console.log("esperado: fulfilled | obtido:", p.state);
});

await section("executor que lança vira rejeição", async () => {
  const p = new MyPromise<number>(() => {
    throw new Error("boom");
  });
  const reason = await p.then(() => "não deveria", (e) => (e as Error).message);
  console.log("esperado: boom | obtido:", reason);
});

await section("encadeamento retorna nova promise", async () => {
  const p1 = MyPromise.resolve(2);
  const p2 = p1.then((v) => v * 10);
  console.log("esperado: true (p1 !== p2) | obtido:", p1 !== p2);
  const result = await p2.then((v) => v + 1).then((v) => `valor=${v}`);
  console.log("esperado: valor=21 | obtido:", result);
});

await section("valores atravessam then sem handler", async () => {
  const value = await MyPromise.resolve("x").then().then(null).then((v) => v);
  console.log("esperado: x | obtido:", value);
  const reason = await MyPromise.reject("erro").then((v) => v).catch((e) => e);
  console.log("esperado: erro | obtido:", reason);
});

await section("erro em handler rejeita a próxima", async () => {
  const msg = await MyPromise.resolve(1)
    .then(() => {
      throw new Error("falhou no then");
    })
    .then(() => "pulado")
    .catch((e) => (e as Error).message);
  console.log("esperado: falhou no then | obtido:", msg);
  const recovered = await MyPromise.reject(new Error("x"))
    .catch(() => "recuperado")
    .then((v) => `${v}!`);
  console.log("esperado: recuperado! | obtido:", recovered);
});

await section("adoção de promise e thenable", async () => {
  const fromMine = await MyPromise.resolve(1).then(() => delay(20, "adotado"));
  console.log("esperado: adotado | obtido:", fromMine);
  const fromNative = await new MyPromise<string>((resolve) =>
    resolve(Promise.resolve("nativa"))
  );
  console.log("esperado: nativa | obtido:", fromNative);
  const thenable = {
    then(onFulfilled: (v: string) => void) {
      onFulfilled("thenable");
    },
  } as PromiseLike<string>;
  console.log(
    "esperado: thenable | obtido:",
    await MyPromise.resolve(thenable),
  );
});

await section("then retornando a própria promise → TypeError", async () => {
  const p: MyPromise<unknown> = MyPromise.resolve(1).then(() => p);
  const reason = await p.then(null, (e) => e);
  console.log(
    "esperado: true (TypeError) | obtido:",
    reason instanceof TypeError,
  );
});

await section("vários then na mesma promise", async () => {
  const log: number[] = [];
  const p = delay(10, 0);
  p.then(() => log.push(1));
  p.then(() => log.push(2));
  p.then(() => log.push(3));
  await p;
  await null;
  console.log("esperado: [1,2,3] | obtido:", JSON.stringify(log));
});

await section("finally", async () => {
  let called = false;
  const v = await MyPromise.resolve(42).finally(() => {
    called = true;
    return "ignorado";
  });
  console.log("esperado: 42 true | obtido:", v, called);
  const r = await MyPromise.reject("motivo").finally(() => {}).catch((e) => e);
  console.log("esperado: motivo | obtido:", r);
  const r2 = await MyPromise.resolve(1)
    .finally(() => {
      throw new Error("finally falhou");
    })
    .catch((e) => (e as Error).message);
  console.log("esperado: finally falhou | obtido:", r2);
});

await section("MyPromise.all", async () => {
  const all = await MyPromise.all([delay(30, "a"), 2, MyPromise.resolve("c")]);
  console.log('esperado: ["a",2,"c"] | obtido:', JSON.stringify(all));
  const empty = await MyPromise.all([]);
  console.log("esperado: [] | obtido:", JSON.stringify(empty));
  const failed = await MyPromise.all([
    delay(50, 1),
    MyPromise.reject("falhou"),
  ]).catch((e) => e);
  console.log("esperado: falhou | obtido:", failed);
});

await section("MyPromise.race", async () => {
  const winner = await MyPromise.race([
    delay(40, "lenta"),
    delay(10, "rápida"),
  ]);
  console.log("esperado: rápida | obtido:", winner);
});

await section("MyPromise.allSettled", async () => {
  const results = await MyPromise.allSettled([
    MyPromise.resolve(1),
    MyPromise.reject("não"),
  ]);
  console.log(
    'esperado: [{"status":"fulfilled","value":1},{"status":"rejected","reason":"não"}] | obtido:',
    JSON.stringify(results),
  );
});

await section("MyPromise.any", async () => {
  const first = await MyPromise.any([
    MyPromise.reject("x"),
    delay(20, "ok"),
    delay(40, "tarde"),
  ]);
  console.log("esperado: ok | obtido:", first);
  const err = await MyPromise.any([
    MyPromise.reject("a"),
    MyPromise.reject("b"),
  ])
    .catch((e) => e);
  console.log(
    'esperado: AggregateError ["a","b"] | obtido:',
    err instanceof AggregateError ? "AggregateError" : err,
    err instanceof AggregateError ? JSON.stringify(err.errors) : "",
  );
});

if (failures > 0) {
  console.log(`\n${failures} seção(ões) falharam.`);
  Deno.exitCode = 1;
}
