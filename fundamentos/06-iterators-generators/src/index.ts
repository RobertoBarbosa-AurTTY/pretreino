/**
 * Fundamentos 06: Iterators e Generators — playground
 *
 * Run with `deno task dev` and compare "esperado" vs "obtido" by eye.
 */

import {
  chunk,
  filter,
  map,
  type Page,
  paginate,
  range,
  take,
} from "./iterators.ts";

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

function* naturals(): Generator<number> {
  let n = 0;
  while (true) yield n++;
}

await section("range", () => {
  console.log("esperado: [ 0, 1, 2, 3, 4 ] | obtido:", [...range(0, 5)]);
  console.log("esperado: [ 0, 3, 6, 9 ] | obtido:", [...range(0, 10, 3)]);
  console.log("esperado: [ 5, 4, 3, 2, 1 ] | obtido:", [...range(5, 0, -1)]);
  const r = range(1, 4);
  console.log(
    "esperado: [ 1, 2, 3 ] [ 1, 2, 3 ] (reutilizável) | obtido:",
    [...r],
    [...r],
  );
});

await section("take", () => {
  console.log("esperado: [ 0, 1, 2 ] | obtido:", [...take(naturals(), 3)]);
});

await section("take / map / filter (lazy)", () => {
  let evaluated = 0;
  const pipeline = take(
    filter(
      map(naturals(), (n) => {
        evaluated++;
        return n * n;
      }),
      (n) => n % 2 === 0,
    ),
    3,
  );
  console.log("esperado: 0 (nada calculado ainda) | obtido:", evaluated);
  console.log("esperado: [ 0, 4, 16 ] | obtido:", [...pipeline]);
  console.log("esperado: 5 (só o necessário) | obtido:", evaluated);
});

await section("chunk", () => {
  console.log("esperado: [ [ 1, 2 ], [ 3, 4 ], [ 5 ] ] | obtido:", [
    ...chunk([1, 2, 3, 4, 5], 2),
  ]);
});

await section("paginate (API falsa em memória)", async () => {
  const fakeDb = Array.from(
    { length: 7 },
    (_, i) => ({ id: i + 1, name: `Cliente ${i + 1}` }),
  );
  const PAGE_SIZE = 3;
  const fetchLog: number[] = [];
  async function fakeFetchPage(
    page: number,
  ): Promise<Page<{ id: number; name: string }>> {
    fetchLog.push(page);
    await new Promise((resolve) => setTimeout(resolve, 10));
    const start = (page - 1) * PAGE_SIZE;
    const items = fakeDb.slice(start, start + PAGE_SIZE);
    return {
      items,
      nextPage: start + PAGE_SIZE < fakeDb.length ? page + 1 : null,
    };
  }

  const ids: number[] = [];
  for await (const cliente of paginate(fakeFetchPage)) ids.push(cliente.id);
  console.log("esperado: [ 1, 2, 3, 4, 5, 6, 7 ] | obtido:", ids);
  console.log("esperado: páginas [ 1, 2, 3 ] | obtido:", fetchLog);

  fetchLog.length = 0;
  for await (const cliente of paginate(fakeFetchPage)) {
    if (cliente.id === 2) break;
  }
  console.log(
    "esperado: páginas [ 1 ] (break não busca mais) | obtido:",
    fetchLog,
  );
});

if (failures > 0) {
  console.log(`\n${failures} seção(ões) falharam.`);
  Deno.exitCode = 1;
}
