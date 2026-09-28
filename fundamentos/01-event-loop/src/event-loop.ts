/**
 * Fundamentos 01: Event Loop
 *
 * Implement each function below. Read the README first.
 */

/** Where a task is scheduled when passed to `runInOrder`. */
export type TaskKind =
  | "sync" // runs immediately, in the current call stack
  | "microtask" // queueMicrotask(...)
  | "promise" // Promise.resolve().then(...)
  | "timeout"; // setTimeout(..., delayMs ?? 0)

export interface ScheduledTask {
  label: string;
  kind: TaskKind;
  /** Only used when kind === "timeout". Defaults to 0. */
  delayMs?: number;
}

/**
 * Returns a promise that resolves after `ms` milliseconds (macrotask queue).
 */
export function sleep(ms: number): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Schedules `fn` to run as a microtask: after the current synchronous code
 * finishes, but before any timer / I/O callback.
 * Errors thrown by `fn` must NOT be thrown synchronously by `defer`.
 */
export function defer(fn: () => void): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Returns a promise that resolves on a *future macrotask* (a new turn of the
 * event loop), giving timers and I/O a chance to run in between.
 */
export function yieldToEventLoop(): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Schedules every task according to its `kind`, in array order, and resolves
 * with the labels in the order the tasks actually EXECUTED.
 * Resolves only after every task has run.
 */
export function runInOrder(tasks: ScheduledTask[]): Promise<string[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Blocks the thread with a synchronous busy loop for `ms` milliseconds.
 * (Yes, on purpose: it is used to observe how blocking delays timers.)
 */
export function busyWait(ms: number): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Schedules a `setTimeout(..., 0)`, then blocks the thread for `blockMs`
 * with `busyWait`. Resolves with how many milliseconds actually passed
 * between scheduling the timer and its callback running.
 */
export function measureTimerDelay(blockMs: number): Promise<number> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Processes `items` with `fn` in chunks of `chunkSize`, calling
 * `yieldToEventLoop()` between chunks so the loop stays responsive.
 * Resolves with the results in the original order.
 */
export async function processInChunks<T, R>(
  items: readonly T[],
  chunkSize: number,
  fn: (item: T, index: number) => R,
): Promise<R[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}
