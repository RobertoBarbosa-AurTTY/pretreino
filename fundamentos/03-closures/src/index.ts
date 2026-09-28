/**
 * Fundamentos 03: Closures — playground
 *
 * Run with `deno task dev` and compare "esperado" vs "obtido" by eye.
 */

import {
  createCounter,
  curry,
  debounce,
  makeCallbacks,
  memoize,
  once,
  throttle,
} from "./closures.ts";

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

await section("once", () => {
  let calls = 0;
  const init = once((name: string) => {
    calls++;
    return `conectado a ${name}`;
  });
  console.log("esperado: conectado a db1 | obtido:", init("db1"));
  console.log("esperado: conectado a db1 | obtido:", init("db2"));
  console.log("esperado: 1 chamada | obtido:", calls);
});

await section("memoize", () => {
  let calls = 0;
  const square = memoize((n: number) => {
    calls++;
    return n * n;
  });
  square(4);
  square(4);
  square(5);
  console.log("esperado: 25 | obtido:", square(5));
  console.log("esperado: 2 chamadas | obtido:", calls);
  console.log("esperado: 2 entradas no cache | obtido:", square.cache.size);
  square.clear();
  square(4);
  console.log("esperado: 3 chamadas após clear | obtido:", calls);

  let sumCalls = 0;
  const sum = memoize(
    (a: number, b: number) => {
      sumCalls++;
      return a + b;
    },
    { resolver: (a, b) => `${a},${b}` },
  );
  sum(1, 2);
  sum(1, 3);
  sum(1, 2);
  console.log("esperado: 2 chamadas (chave usa os 2 args) | obtido:", sumCalls);
});

await section("debounce", async () => {
  const calls: string[] = [];
  const search = debounce((term: string) => calls.push(term), 50);
  search("d");
  search("de");
  search("den");
  search("deno");
  console.log("esperado: [] (ainda esperando) | obtido:", [...calls]);
  await sleep(80);
  console.log("esperado: [ 'deno' ] | obtido:", [...calls]);

  search("cancelado");
  search.cancel();
  await sleep(80);
  console.log("esperado: [ 'deno' ] (cancel funcionou) | obtido:", calls);
});

await section("throttle", async () => {
  const calls: number[] = [];
  const onScroll = throttle((y: number) => calls.push(y), 50);
  onScroll(1); // leading
  onScroll(2);
  onScroll(3); // trailing, with the latest args
  console.log("esperado: [1] | obtido:", JSON.stringify(calls));
  await sleep(80);
  console.log("esperado: [1,3] | obtido:", JSON.stringify(calls));
  await sleep(80);
  onScroll(4);
  console.log("esperado: [1,3,4] | obtido:", JSON.stringify(calls));
  onScroll.cancel();
});

await section("createCounter", () => {
  const c = createCounter(10, 5);
  c.increment();
  c.increment();
  console.log("esperado: 20 | obtido:", c.value());
  console.log("esperado: 15 | obtido:", c.decrement());
  c.reset();
  console.log("esperado: 10 | obtido:", c.value());
  const other = createCounter();
  other.increment();
  console.log(
    "esperado: 1 e 10 (contadores independentes) | obtido:",
    other.value(),
    c.value(),
  );
  console.log(
    "esperado: [ 'increment', 'decrement', 'reset', 'value' ] (sem estado exposto) | obtido:",
    Object.keys(c),
  );
});

await section("makeCallbacks", () => {
  const fns = makeCallbacks(3);
  console.log(
    "esperado: [0,1,2] | obtido:",
    JSON.stringify(fns.map((f) => f())),
  );
});

await section("curry", () => {
  const volume = (l: number, w: number, h: number) => l * w * h;
  const curried = curry(volume);
  console.log("esperado: 24 | obtido:", curried(2)(3)(4));
  const base = curried(2)(3);
  console.log("esperado: 6 e 60 (reuso parcial) | obtido:", base(1), base(10));
  const greet = curry((greeting: string, name: string) =>
    `${greeting}, ${name}!`
  );
  console.log("esperado: Olá, Deno! | obtido:", greet("Olá")("Deno"));
});

if (failures > 0) {
  console.log(`\n${failures} seção(ões) falharam.`);
  Deno.exitCode = 1;
}
