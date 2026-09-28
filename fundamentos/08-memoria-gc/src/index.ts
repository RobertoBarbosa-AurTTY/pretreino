/**
 * Fundamentos 08: Memória e Garbage Collection — playground
 *
 * Run with `deno task dev` and compare "esperado" vs "obtido" by eye.
 * Heap numbers vary between runs: look at the order of magnitude.
 */

import {
  createLeakyCache,
  createWeakCache,
  createWeakRefCache,
  formatBytes,
  type LeakyCache,
  measureHeap,
} from "./memory.ts";

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

const gc = (globalThis as { gc?: () => void }).gc;
console.log("gc exposto (--v8-flags=--expose-gc):", typeof gc === "function");

const ENTRIES = 2_000;
/** ~10 KB no heap do V8 por entrada (array de números). */
const bigPayload = (i: number) => new Array<number>(1_250).fill(i);

await section("formatBytes", () => {
  console.log('esperado: "512 B" | obtido:', formatBytes(512));
  console.log('esperado: "2.0 KB" | obtido:', formatBytes(2048));
  console.log('esperado: "5.0 MB" | obtido:', formatBytes(5_242_880));
  console.log('esperado: "-1.5 KB" | obtido:', formatBytes(-1536));
});

// Kept at module scope on purpose: the cache stays reachable (that's the leak).
let leaky: LeakyCache<object, number[]> | undefined;

await section("createLeakyCache (Map)", async () => {
  const cache = createLeakyCache<object, number[]>();
  leaky = cache;
  const leakyRun = await measureHeap(() => {
    // As chaves são criadas aqui e "esquecidas" logo em seguida...
    for (let i = 0; i < ENTRIES; i++) {
      cache.set({ requestId: i }, bigPayload(i));
    }
    return cache.size();
  });
  console.log(`esperado: ${ENTRIES} entradas | obtido:`, leakyRun.result);
  console.log(
    "esperado: ~20 MB retidos | obtido:",
    formatBytes(leakyRun.deltaBytes),
  );
});

await section("createWeakCache (WeakMap)", async () => {
  const weak = createWeakCache<object, number[]>();
  const keptKey = { requestId: -1 };
  const weakRun = await measureHeap(() => {
    weak.set(keptKey, bigPayload(-1));
    for (let i = 0; i < ENTRIES; i++) {
      weak.set({ requestId: i }, bigPayload(i));
    }
  });
  console.log(
    "esperado: perto de 0 B (com gc exposto) | obtido:",
    formatBytes(weakRun.deltaBytes),
  );
  console.log(
    "esperado: true (chave ainda alcançável) | obtido:",
    weak.has(keptKey),
  );
});

await section(
  "createWeakRefCache (WeakRef + FinalizationRegistry)",
  async () => {
    const collectedKeys: number[] = [];
    const refCache = createWeakRefCache<number, { data: number[] }>({
      onCollect: (key) => collectedKeys.push(key),
    });
    const survivor = { data: bigPayload(0) };
    refCache.set(0, survivor);
    (function fillAndForget() {
      for (let i = 1; i <= 100; i++) refCache.set(i, { data: bigPayload(i) });
    })();
    console.log("esperado: 101 | obtido:", refCache.size());

    gc?.();
    // Callbacks de finalização rodam depois, numa task separada.
    await new Promise((resolve) => setTimeout(resolve, 50));
    gc?.();
    await new Promise((resolve) => setTimeout(resolve, 50));

    console.log(
      "esperado: true (ainda referenciado) | obtido:",
      refCache.get(0) === survivor,
    );
    console.log(
      "esperado: > 0 com gc exposto (não é garantido!) | obtido:",
      refCache.collectedCount(),
      "| size agora:",
      refCache.size(),
      "| onCollect chamado",
      collectedKeys.length,
      "vezes",
    );
  },
);

if (failures > 0) {
  console.log(`\n${failures} seção(ões) falharam.`);
  Deno.exitCode = 1;
}
