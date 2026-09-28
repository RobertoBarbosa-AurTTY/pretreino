/**
 * Fundamentos 04: this, call, apply, bind
 *
 * Part 1: re-implement call/apply/bind WITHOUT using Function.prototype.call,
 * .apply, .bind or Reflect.apply (hint: a temporary Symbol-keyed property).
 * Part 2: fix the lost-`this` bugs in the classes below.
 * Read the README first.
 */

// ---------------------------------------------------------------------------
// Part 1: call / apply / bind
// ---------------------------------------------------------------------------

/**
 * Calls `fn` with `this === thisArg` and the given arguments.
 * `null`/`undefined` → `globalThis`; primitives are boxed with `Object(...)`.
 */
export function myCall<T, A extends unknown[], R>(
  fn: (this: T, ...args: A) => R,
  thisArg: T,
  ...args: A
): R {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Same as `myCall`, but arguments come as an array (or are omitted).
 */
export function myApply<T, A extends unknown[], R>(
  fn: (this: T, ...args: A) => R,
  thisArg: T,
  args?: A,
): R {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Returns a new function that always calls `fn` with `this === thisArg`,
 * prepending `boundArgs` to the arguments it receives (partial application).
 */
export function myBind<T, B extends unknown[], A extends unknown[], R>(
  fn: (this: T, ...args: [...B, ...A]) => R,
  thisArg: T,
  ...boundArgs: B
): (...args: A) => R {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Binds, IN PLACE, each listed method of `obj` to `obj` itself, so they can
 * be passed around as callbacks. Returns the same object.
 */
export function bindAll<T extends object>(
  obj: T,
  methodNames: ReadonlyArray<keyof T>,
): T {
  // TODO: Implement
  throw new Error("Not implemented");
}

// ---------------------------------------------------------------------------
// Part 2: lost-`this` bugs — fix them (do NOT change the public API)
// ---------------------------------------------------------------------------

/**
 * BUG: `formatAll` passes `this.formatLine` as a bare callback to `map`.
 * Fix it (see the README for three different approaches).
 */
export class ReportFormatter {
  constructor(private readonly prefix: string) {}

  formatLine(line: string): string {
    return `${this.prefix} ${line}`;
  }

  formatAll(lines: string[]): string[] {
    // TODO: fix the lost `this` below
    return lines.map(this.formatLine);
  }
}

/**
 * BUG: `start` passes `this.tick` to `setInterval`, so inside `tick`
 * `this` is not the instance and `count` never increases.
 * Fix it so `start()` makes `count` grow and `stop()` stops it.
 */
export class HeartbeatMonitor {
  count = 0;
  private timerId: ReturnType<typeof setInterval> | undefined;

  tick(): void {
    this.count++;
  }

  start(intervalMs: number): void {
    // TODO: fix the lost `this` below
    this.timerId = setInterval(this.tick, intervalMs);
  }

  stop(): void {
    clearInterval(this.timerId);
    this.timerId = undefined;
  }
}
