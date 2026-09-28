/**
 * Fundamentos 01: Event Loop — playground
 *
 * Run with `deno task dev` and compare "esperado" vs "obtido" by eye.
 */

import {
  busyWait,
  defer,
  measureTimerDelay,
  processInChunks,
  runInOrder,
  sleep,
  yieldToEventLoop,
} from "./event-loop.ts";

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

await section("sleep", async () => {
  const start = performance.now();
  await sleep(100);
  const elapsed = Math.round(performance.now() - start);
  console.log("esperado: ~100ms (>= 100) | obtido:", `${elapsed}ms`);
});

await section("defer", async () => {
  const log: string[] = [];
  defer(() => log.push("deferred"));
  log.push("sync");
  console.log("esperado: [ 'sync' ] | obtido:", [...log]);
  await Promise.resolve();
  console.log("esperado: [ 'sync', 'deferred' ] | obtido:", log);
});

await section("yieldToEventLoop", async () => {
  const log: string[] = [];
  setTimeout(() => log.push("timer"), 0);
  Promise.resolve().then(() => log.push("microtask"));
  await yieldToEventLoop();
  log.push("after yield");
  console.log(
    "esperado: [ 'microtask', 'timer', 'after yield' ] | obtido:",
    log,
  );
});

await section("runInOrder", async () => {
  const order = await runInOrder([
    { label: "A", kind: "timeout" },
    { label: "B", kind: "promise" },
    { label: "C", kind: "sync" },
    { label: "D", kind: "microtask" },
    { label: "E", kind: "timeout", delayMs: 20 },
    { label: "F", kind: "sync" },
  ]);
  console.log(
    "esperado: [ 'C', 'F', 'B', 'D', 'A', 'E' ] | obtido:",
    order,
  );

  const onlyTimers = await runInOrder([
    { label: "slow", kind: "timeout", delayMs: 30 },
    { label: "fast", kind: "timeout", delayMs: 5 },
  ]);
  console.log("esperado: [ 'fast', 'slow' ] | obtido:", onlyTimers);

  const empty = await runInOrder([]);
  console.log("esperado: [] | obtido:", empty);
});

await section("busyWait", () => {
  const start = performance.now();
  busyWait(50);
  const elapsed = Math.round(performance.now() - start);
  console.log("esperado: >= 50ms | obtido:", `${elapsed}ms`);
});

await section("measureTimerDelay", async () => {
  const delay = await measureTimerDelay(200);
  console.log(
    "esperado: >= 200ms (o timer de 0ms esperou o bloqueio) | obtido:",
    `${Math.round(delay)}ms`,
  );
});

await section("processInChunks", async () => {
  let ticks = 0;
  const interval = setInterval(() => ticks++, 0);
  const items = Array.from({ length: 10 }, (_, i) => i);
  let result: number[];
  try {
    result = await processInChunks(items, 3, (n) => n * 2);
  } finally {
    clearInterval(interval);
  }
  console.log(
    "esperado: [0,2,4,6,8,10,12,14,16,18] | obtido:",
    JSON.stringify(result),
  );
  console.log(
    "esperado: ticks > 0 (o setInterval conseguiu rodar entre chunks) | obtido:",
    ticks,
  );
  const invalid = await processInChunks(items, 0, (n) => n).then(
    () => "não lançou",
    (e) => (e instanceof RangeError ? "RangeError" : String(e)),
  );
  console.log("esperado: RangeError (chunkSize 0) | obtido:", invalid);
});

if (failures > 0) {
  console.log(`\n${failures} seção(ões) falharam.`);
  Deno.exitCode = 1;
}
