/**
 * Fundamentos 04: this, call, apply, bind — playground
 *
 * Run with `deno task dev` and compare "esperado" vs "obtido" by eye.
 */

import {
  bindAll,
  HeartbeatMonitor,
  myApply,
  myBind,
  myCall,
  ReportFormatter,
} from "./this.ts";

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

interface User {
  name: string;
}

function greet(this: User, greeting: string, punctuation: string): string {
  return `${greeting}, ${this.name}${punctuation}`;
}

const ana: User = { name: "Ana" };

await section("myCall", () => {
  console.log("esperado: Olá, Ana! | obtido:", myCall(greet, ana, "Olá", "!"));
  const keysBefore = Reflect.ownKeys(ana).length;
  myCall(greet, ana, "Oi", ".");
  console.log(
    "esperado: 1 (não deixou propriedade temporária) | obtido:",
    keysBefore,
    "→",
    Reflect.ownKeys(ana).length,
  );
  const typeOfThis = myCall(function (this: unknown) {
    return typeof this;
  }, 42);
  console.log("esperado: object (primitivo encaixotado) | obtido:", typeOfThis);
  const isGlobal = myCall(function (this: unknown) {
    return this === globalThis;
  }, null);
  console.log("esperado: true (null → globalThis) | obtido:", isGlobal);
});

await section("myApply", () => {
  console.log(
    "esperado: Bom dia, Ana? | obtido:",
    myApply(greet, ana, ["Bom dia", "?"]),
  );
  const max = myApply(
    function (this: null, ...nums: number[]) {
      return Math.max(...nums);
    },
    null,
    [3, 9, 2],
  );
  console.log("esperado: 9 | obtido:", max);
  const noArgs = myApply(function (this: User) {
    return this.name;
  }, ana);
  console.log("esperado: Ana (args omitidos) | obtido:", noArgs);
});

await section("myBind", () => {
  const bound = myBind(greet, ana);
  console.log("esperado: Olá, Ana! | obtido:", bound("Olá", "!"));

  const hello = myBind(greet, ana, "Hello");
  console.log("esperado: Hello, Ana!!! (parcial) | obtido:", hello("!!!"));

  const other: User = { name: "Bruno" };
  const stolen = { name: "Carla", fn: bound };
  console.log(
    "esperado: Oi, Ana. (this fixo, mesmo chamado como método) | obtido:",
    stolen.fn("Oi", "."),
  );
  const rebound = myBind(
    bound as (this: User, g: string, p: string) => string,
    other,
  );
  console.log(
    "esperado: Oi, Ana. (bind de bound não troca o this) | obtido:",
    rebound("Oi", "."),
  );
});

await section("bindAll", () => {
  const service = {
    base: "/api",
    url(path: string) {
      return `${this.base}${path}`;
    },
  };
  bindAll(service, ["url"]);
  const { url } = service;
  console.log("esperado: /api/clientes | obtido:", url("/clientes"));
});

await section("ReportFormatter (bug de this em map)", () => {
  const formatter = new ReportFormatter("[relatório]");
  console.log(
    "esperado: [ '[relatório] a', '[relatório] b' ] | obtido:",
    formatter.formatAll(["a", "b"]),
  );
});

await section("HeartbeatMonitor (bug de this em setInterval)", async () => {
  const monitor = new HeartbeatMonitor();
  monitor.start(10);
  await new Promise((r) => setTimeout(r, 100));
  monitor.stop();
  const countAtStop = monitor.count;
  await new Promise((r) => setTimeout(r, 30));
  console.log("esperado: >= 3 | obtido:", countAtStop);
  console.log(
    "esperado: true (parou depois do stop) | obtido:",
    monitor.count === countAtStop,
  );
});

if (failures > 0) {
  console.log(`\n${failures} seção(ões) falharam.`);
  Deno.exitCode = 1;
}
