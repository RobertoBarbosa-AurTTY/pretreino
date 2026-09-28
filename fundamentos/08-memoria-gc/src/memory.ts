/**
 * Fundamentos 08 — Memória e Garbage Collection
 *
 * Implemente os três caches e o medidor de heap. A ideia é COMPARAR como cada
 * estrutura afeta a alcançabilidade (reachability) dos objetos.
 */

/** Cache associado a objetos (ex.: dados derivados de uma request). */
export interface ObjectKeyedCache<K extends object, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
}

/** Cache "vazante": mantém referência FORTE às chaves. */
export interface LeakyCache<K extends object, V>
  extends ObjectKeyedCache<K, V> {
  /** Quantidade de entradas guardadas. */
  size(): number;
}

/**
 * Cache com `Map` comum.
 *
 * - Enquanto a entrada existir, a CHAVE e o VALOR nunca podem ser coletados,
 *   mesmo que ninguém mais use a chave — é um vazamento clássico.
 * - `size()` devolve o número de entradas.
 */
export function createLeakyCache<K extends object, V>(): LeakyCache<K, V> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Cache com `WeakMap`.
 *
 * - Quando a CHAVE deixa de ser alcançável em qualquer outro lugar, a entrada
 *   (chave + valor) pode ser coletada automaticamente.
 * - Não há `size()`: um WeakMap não é enumerável (por quê? veja o README).
 */
export function createWeakCache<K extends object, V>(): ObjectKeyedCache<K, V> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/** Cache cujos VALORES podem ser coletados. */
export interface WeakRefCache<K, V extends object> {
  /** Devolve o valor se ele ainda estiver vivo; senão `undefined`. */
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  /** Número de entradas no Map interno (inclui refs mortas ainda não limpas). */
  size(): number;
  /** Quantas entradas já foram removidas pelo FinalizationRegistry. */
  collectedCount(): number;
}

/**
 * Cache com chaves primitivas (ex.: id, URL) e valores guardados via `WeakRef`.
 *
 * - `Map<K, WeakRef<V>>` internamente
 * - `get` faz `deref()`; se o valor já foi coletado, remove a entrada e
 *   devolve `undefined`
 * - Usa `FinalizationRegistry` para remover do Map as entradas cujos valores
 *   foram coletados, chamando `onCollect(key)` quando isso acontecer
 * - Cuidado: se `set` sobrescrever uma chave, a finalização do valor ANTIGO
 *   não pode apagar a entrada NOVA
 */
export function createWeakRefCache<K, V extends object>(
  options?: { onCollect?: (key: K) => void },
): WeakRefCache<K, V> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/** Resultado de uma medição de heap. */
export interface HeapMeasurement<R> {
  /** Valor retornado por `fn`. */
  result: R;
  /** `heapUsed` antes de executar `fn` (bytes). */
  heapBefore: number;
  /** `heapUsed` depois de executar `fn` (bytes). */
  heapAfter: number;
  /** `heapAfter - heapBefore` (pode ser negativo). */
  deltaBytes: number;
  /** Tempo de execução de `fn` em milissegundos. */
  durationMs: number;
}

/**
 * Mede quanto o heap cresceu ao executar `fn` (sync ou async).
 *
 * - Usa `Deno.memoryUsage().heapUsed`
 * - Se `globalThis.gc` existir (rodando com `--v8-flags=--expose-gc`), força
 *   uma coleta ANTES de cada leitura para reduzir ruído
 * - Aguarda `fn` se ela devolver uma Promise
 */
export async function measureHeap<R>(
  fn: () => R | Promise<R>,
): Promise<HeapMeasurement<R>> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Formata bytes de forma legível: `512` → `"512 B"`, `2048` → `"2.0 KB"`,
 * `5_242_880` → `"5.0 MB"`. Valores negativos mantêm o sinal (`"-1.5 KB"`).
 */
export function formatBytes(bytes: number): string {
  // TODO: Implement
  throw new Error("Not implemented");
}
