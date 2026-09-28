/**
 * Fundamentos 02: Promises do zero
 *
 * Implement a Promises/A+ compliant `MyPromise<T>` WITHOUT using the native
 * `Promise` (you may use `queueMicrotask` to schedule callbacks).
 * Read the README first.
 */

export type PromiseState = "pending" | "fulfilled" | "rejected";

export type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
export type RejectFn = (reason?: unknown) => void;
export type Executor<T> = (resolve: ResolveFn<T>, reject: RejectFn) => void;

export type SettledResult<T> =
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; reason: unknown };

export class MyPromise<T> implements PromiseLike<T> {
  // TODO: declare your private state here (state, value/reason, callbacks queue)

  constructor(executor: Executor<T>) {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Current state, useful for debugging and for the playground. */
  get state(): PromiseState {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): MyPromise<TResult1 | TResult2> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  catch<TResult = never>(
    onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ): MyPromise<T | TResult> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  finally(onFinally?: (() => unknown) | null): MyPromise<T> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  static resolve(): MyPromise<void>;
  static resolve<T>(value: T | PromiseLike<T>): MyPromise<Awaited<T>>;
  static resolve<T>(value?: T | PromiseLike<T>): MyPromise<Awaited<T> | void> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  static reject<T = never>(reason?: unknown): MyPromise<T> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  static all<T extends readonly unknown[] | []>(
    values: T,
  ): MyPromise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  static race<T extends readonly unknown[] | []>(
    values: T,
  ): MyPromise<Awaited<T[number]>> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  static allSettled<T extends readonly unknown[] | []>(
    values: T,
  ): MyPromise<{ -readonly [P in keyof T]: SettledResult<Awaited<T[P]>> }> {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  static any<T extends readonly unknown[] | []>(
    values: T,
  ): MyPromise<Awaited<T[number]>> {
    // TODO: Implement
    throw new Error("Not implemented");
  }
}
