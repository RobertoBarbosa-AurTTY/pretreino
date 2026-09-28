/**
 * Fundamentos 09: Estruturas de Dados — playground
 *
 * Run with `deno task dev` and compare "esperado" vs "obtido" by eye.
 */

import { LRUCache, PriorityQueue, Trie } from "./structures.ts";

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

await section("LRUCache", () => {
  const evicted: string[] = [];
  const lru = new LRUCache<string, number>(3, (key) => evicted.push(key));
  lru.set("a", 1);
  lru.set("b", 2);
  lru.set("c", 3);
  lru.get("a"); // "a" vira a mais recente
  lru.set("d", 4); // cheio: remove a menos recente ("b")
  console.log('esperado: [ "c", "a", "d" ] | obtido:', lru.keys());
  console.log('esperado: [ "b" ] | obtido:', evicted);
  console.log("esperado: undefined | obtido:", lru.get("b"));
  lru.set("c", 30); // atualiza e torna mais recente
  console.log('esperado: [ "a", "d", "c" ] | obtido:', lru.keys());
  console.log(
    'esperado: true [ "a", "d", "c" ] (has não altera a ordem) | obtido:',
    lru.has("a"),
    lru.keys(),
  );
  console.log("esperado: 3 | obtido:", lru.size);
});

await section("PriorityQueue (min-heap padrão)", () => {
  const pq = new PriorityQueue<number>();
  for (const n of [5, 1, 8, 3, 9, 2]) pq.push(n);
  console.log("esperado: 1 (peek) | obtido:", pq.peek());
  const drained: number[] = [];
  while (!pq.isEmpty()) drained.push(pq.pop()!);
  console.log("esperado: [ 1, 2, 3, 5, 8, 9 ] | obtido:", drained);
  console.log("esperado: undefined | obtido:", pq.pop());
});

await section("PriorityQueue com comparador (jobs por prioridade)", () => {
  interface Job {
    id: string;
    priority: number; // maior = mais urgente
    createdAt: number;
  }
  const jobs = new PriorityQueue<Job>((a, b) =>
    b.priority - a.priority || a.createdAt - b.createdAt
  );
  jobs.push({ id: "email", priority: 1, createdAt: 1 });
  jobs.push({ id: "pagamento", priority: 10, createdAt: 2 });
  jobs.push({ id: "relatorio", priority: 5, createdAt: 3 });
  jobs.push({ id: "estorno", priority: 10, createdAt: 4 });
  const order: string[] = [];
  while (jobs.size > 0) order.push(jobs.pop()!.id);
  console.log(
    'esperado: [ "pagamento", "estorno", "relatorio", "email" ] | obtido:',
    order,
  );
});

await section("Trie (autocomplete)", () => {
  const trie = new Trie();
  const words = ["Deno", "deno", "denoland", "delta", "dev", "node", "devops"];
  for (const w of words) trie.insert(w);
  console.log("esperado: 6 | obtido:", trie.size);
  console.log("esperado: true | obtido:", trie.has("dev"));
  console.log("esperado: false (só prefixo) | obtido:", trie.has("den"));
  console.log(
    'esperado: [ "delta", "deno", "denoland", "dev", "devops" ] | obtido:',
    trie.startsWith("de"),
  );
  console.log(
    'esperado: [ "dev", "devops" ] | obtido:',
    trie.startsWith("DEV"),
  );
  console.log(
    'esperado: [ "delta", "deno" ] | obtido:',
    trie.startsWith("de", 2),
  );
  console.log("esperado: [] | obtido:", trie.startsWith("x"));
  console.log("esperado: true | obtido:", trie.delete("deno"));
  console.log('esperado: [ "denoland" ] | obtido:', trie.startsWith("deno"));
});

if (failures > 0) {
  console.log(`\n${failures} seção(ões) falharam.`);
  Deno.exitCode = 1;
}
