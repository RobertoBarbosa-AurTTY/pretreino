/**
 * Fundamentos 03: Closures
 *
 * Every function here must keep its state inside a closure: no module-level
 * variables, no classes. Read the README first.
 */

/**
 * Returns a function that calls `fn` only the first time. Later calls return
 * the result of the first call without calling `fn` again.
 */
export function once<A extends unknown[], R>(
  fn: (...args: A) => R,
): (...args: A) => R {
  // TODO: Implement
  throw new Error("Not implemented");
}

export interface MemoizeOptions<A extends unknown[]> {
  /** Builds the cache key from the arguments. Default: the first argument. */
  resolver?: (...args: A) => unknown;
}

export interface Memoized<A extends unknown[], R> {
  (...args: A): R;
  /** The underlying cache, exposed for inspection. */
  readonly cache: Map<unknown, R>;
  /** Empties the cache. */
  clear(): void;
}

/**
 * Caches the results of `fn` by key (see `MemoizeOptions.resolver`).
 */
export function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
  options?: MemoizeOptions<A>,
): Memoized<A, R> {
  // TODO: Implement
  throw new Error("Not implemented");
}

export interface Cancelable<A extends unknown[]> {
  (...args: A): void;
  /** Cancels any pending call. */
  cancel(): void;
}

/**
 * Delays calling `fn` until `waitMs` have passed without new calls.
 * Only the LAST call's arguments are used.
 */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  waitMs: number,
): Cancelable<A> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Calls `fn` at most once every `intervalMs`: the first call runs right away
 * (leading); calls during the interval are collapsed into one trailing call
 * with the latest arguments, at the end of the interval.
 */
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  intervalMs: number,
): Cancelable<A> {
  // TODO: Implement
  throw new Error("Not implemented");
}

export interface Counter {
  increment(): number;
  decrement(): number;
  reset(): void;
  value(): number;
}

/**
 * Creates a counter whose state is private (not reachable as a property).
 */
export function createCounter(initial = 0, step = 1): Counter {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * The classic `var`-in-loop bug: returns `n` functions where the i-th one
 * returns `i`. (The naive `var` version returns `n` from every function.)
 */
export function makeCallbacks(n: number): Array<() => number> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/** Curried version of a function with parameters `A`, one argument at a time. */
export type Curried<A extends unknown[], R> = A extends [infer H, ...infer T]
  ? (arg: H) => T extends [] ? R : Curried<T, R>
  : R;

/**
 * Transforms `fn(a, b, c)` into `fn(a)(b)(c)`, using `fn.length` to know
 * how many arguments to collect.
 */
export function curry<A extends unknown[], R>(
  fn: (...args: A) => R,
): Curried<A, R> {
  // TODO: Implement
  throw new Error("Not implemented");
}
