/**
 * Fundamentos 09 — Estruturas de dados
 *
 * Implemente as três classes. Respeite as complexidades pedidas em cada método.
 * Não use `Array.prototype.sort` dentro da PriorityQueue.
 */

/**
 * Cache LRU (Least Recently Used) com capacidade fixa.
 *
 * - `get` e `set` em O(1)
 * - `get` de uma chave existente a torna a MAIS recente
 * - `set` de chave existente atualiza o valor e a torna a mais recente
 * - `set` de chave nova com o cache cheio remove a MENOS recente e chama
 *   `onEvict(key, value)` (se informado)
 * - `capacity < 1` lança `RangeError`
 */
export class LRUCache<K, V> {
  constructor(
    public readonly capacity: number,
    private readonly onEvict?: (key: K, value: V) => void,
  ) {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Devolve o valor (marcando como usado) ou `undefined`. O(1). */
  get(key: K): V | undefined {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Insere/atualiza. O(1). */
  set(key: K, value: V): void {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Verifica existência SEM alterar a ordem de uso. O(1). */
  has(key: K): boolean {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Remove a chave; devolve `true` se ela existia. O(1). */
  delete(key: K): boolean {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Número de entradas. */
  get size(): number {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Chaves da MENOS recente para a MAIS recente. O(n). */
  keys(): K[] {
    // TODO: Implement
    throw new Error("Not implemented");
  }
}

/**
 * Comparador no estilo de `Array.prototype.sort`: negativo se `a` deve sair
 * ANTES de `b`.
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Fila de prioridade implementada como heap binário num array.
 *
 * - `push` e `pop` em O(log n); `peek` e `size` em O(1)
 * - O elemento que sai primeiro é o "menor" segundo `compare`
 *   (padrão: `(a, b) => a < b ? -1 : a > b ? 1 : 0` — min-heap)
 * - `pop`/`peek` em fila vazia devolvem `undefined`
 */
export class PriorityQueue<T> {
  constructor(compare?: Comparator<T>) {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Insere um item. O(log n). */
  push(item: T): void {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Remove e devolve o item de maior prioridade. O(log n). */
  pop(): T | undefined {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Devolve o item de maior prioridade sem remover. O(1). */
  peek(): T | undefined {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  get size(): number {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  isEmpty(): boolean {
    // TODO: Implement
    throw new Error("Not implemented");
  }
}

/**
 * Árvore de prefixos (Trie) para palavras.
 *
 * - Palavras são normalizadas para minúsculas
 * - `insert` e `has` em O(m), m = tamanho da palavra
 * - `startsWith(prefix)` devolve TODAS as palavras com o prefixo, em ordem
 *   alfabética; `limit` limita a quantidade
 * - `startsWith("")` devolve todas as palavras
 */
export class Trie {
  /** Insere a palavra (inserir duas vezes não duplica). */
  insert(word: string): void {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** `true` se a palavra INTEIRA foi inserida (prefixo não conta). */
  has(word: string): boolean {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Palavras que começam com `prefix`, em ordem alfabética. */
  startsWith(prefix: string, limit?: number): string[] {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Remove a palavra; devolve `true` se ela existia. Prefixos de outras palavras continuam. */
  delete(word: string): boolean {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Número de palavras distintas. */
  get size(): number {
    // TODO: Implement
    throw new Error("Not implemented");
  }
}
