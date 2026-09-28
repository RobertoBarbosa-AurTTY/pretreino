/**
 * Fundamentos 06 — Iterators & Generators
 *
 * Implemente cada função abaixo. Todas as funções de transformação devem ser
 * PREGUIÇOSAS (lazy): nada é calculado até alguém pedir o próximo valor.
 */

/**
 * Cria um iterável de números de `start` (inclusivo) até `end` (exclusivo),
 * avançando de `step` em `step`.
 *
 * - `step` padrão: 1
 * - `step` negativo conta para baixo (`range(5, 0, -1)` → 5,4,3,2,1)
 * - `step === 0` lança `RangeError`
 * - O objeto retornado deve ser reutilizável: cada `for...of` recomeça do início.
 */
export function range(start: number, end: number, step = 1): Iterable<number> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Retorna no máximo os `n` primeiros itens de `iterable`.
 * Não pode consumir o item `n + 1` (funciona com iteráveis infinitos).
 * `n <= 0` não produz nada.
 */
export function* take<T>(iterable: Iterable<T>, n: number): Generator<T> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Aplica `fn(item, index)` a cada item, de forma preguiçosa.
 */
export function* map<T, U>(
  iterable: Iterable<T>,
  fn: (item: T, index: number) => U,
): Generator<U> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Mantém apenas os itens em que `predicate(item, index)` é verdadeiro,
 * de forma preguiçosa.
 */
export function* filter<T>(
  iterable: Iterable<T>,
  predicate: (item: T, index: number) => boolean,
): Generator<T> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Agrupa os itens em arrays de tamanho `size`. O último grupo pode ser menor.
 * `size < 1` lança `RangeError`.
 */
export function* chunk<T>(iterable: Iterable<T>, size: number): Generator<T[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/** Uma página retornada por uma API paginada. */
export interface Page<T> {
  items: T[];
  /** Número da próxima página, ou `null` quando não há mais páginas. */
  nextPage: number | null;
}

/** Função que busca uma página (começando em 1). */
export type FetchPage<T> = (page: number) => Promise<Page<T>>;

/**
 * Percorre uma API paginada e entrega os itens UM A UM.
 *
 * - Começa na página 1 e segue `nextPage` até ser `null`
 * - Só busca a próxima página quando os itens da atual acabarem
 *   (se o consumidor der `break`, nenhuma página extra é buscada)
 * - Erros de `fetchPage` devem chegar ao `for await` do consumidor
 */
export async function* paginate<T>(fetchPage: FetchPage<T>): AsyncGenerator<T> {
  // TODO: Implement
  throw new Error("Not implemented");
}
