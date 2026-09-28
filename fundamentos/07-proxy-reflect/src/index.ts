/**
 * Fundamentos 07: Proxy e Reflect — playground
 *
 * Run with `deno task dev` and compare "esperado" vs "obtido" by eye.
 */

import {
  type ChangeEvent,
  createLoggingProxy,
  type LogEntry,
  reactive,
  readonly,
  validated,
  withDefaults,
} from "./proxy.ts";

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

/** Runs `fn` and returns the name of the error it threw (or "não lançou"). */
function tryRun(fn: () => void): string {
  try {
    fn();
    return "não lançou";
  } catch (e) {
    return (e as Error).name;
  }
}

await section("reactive", () => {
  const events: ChangeEvent[] = [];
  const state = reactive(
    {
      count: 0,
      user: { name: "Ana", address: { city: "Belém" } },
      list: [1, 2, 3],
    },
    (e) => events.push(e),
  );
  state.count = 1;
  state.count = 1; // mesmo valor: não notifica
  state.user.address.city = "Marabá";
  state.list.push(4);
  delete (state.user as { name?: string }).name;
  console.log("esperado: 4 eventos | obtido:", events.length);
  console.log(
    'esperado: { type: "set", path: [ "count" ], oldValue: 0, newValue: 1 } | obtido:',
    events[0],
  );
  console.log(
    'esperado: set [ "user", "address", "city" ] "Belém" → "Marabá" | obtido:',
    events[1],
  );
  console.log(
    'esperado: set [ "list", "3" ] undefined → 4 | obtido:',
    events[2],
  );
  console.log(
    'esperado: delete [ "user", "name" ] "Ana" → undefined | obtido:',
    events[3],
  );
  console.log(
    "esperado: true (mesmo proxy) | obtido:",
    state.user === state.user,
  );
});

await section("readonly", () => {
  const original = { db: { host: "localhost", port: 5432 } };
  const config = readonly(original);
  console.log("esperado: localhost | obtido:", config.db.host);
  console.log(
    "esperado: ReadonlyError | obtido:",
    tryRun(() => ((config as { db: { host: string } }).db.host = "x")),
  );
  console.log(
    "esperado: ReadonlyError | obtido:",
    tryRun(() => delete (config as { db?: unknown }).db),
  );
  original.db.port = 3306;
  console.log("esperado: 3306 (reflete o original) | obtido:", config.db.port);
});

await section("withDefaults", () => {
  const opts = withDefaults<
    { timeout?: number; retries?: number },
    { timeout: number; retries: number }
  >(
    { retries: undefined },
    { timeout: 5000, retries: 3 },
  );
  console.log("esperado: 5000 | obtido:", opts.timeout);
  console.log("esperado: undefined (existe no obj) | obtido:", opts.retries);
  console.log("esperado: true | obtido:", "timeout" in opts);
});

await section("validated", () => {
  const user = validated(
    { name: "Ana", age: 30 },
    {
      name: (v) =>
        (typeof v === "string" && v.length > 0) || "must be a non-empty string",
      age: (v) =>
        (typeof v === "number" && v >= 0) || "must be a positive number",
    },
  );
  user.age = 31;
  console.log("esperado: 31 | obtido:", user.age);
  console.log(
    "esperado: ValidationError | obtido:",
    tryRun(() => (user.age = -1)),
  );
  console.log("esperado: 31 (não gravou) | obtido:", user.age);
  console.log(
    "esperado: ValidationError | obtido:",
    tryRun(() => ((user as Record<string, unknown>).email = "a@b.c")),
  );
});

await section("createLoggingProxy", () => {
  const log: LogEntry[] = [];
  const calc = createLoggingProxy(
    {
      total: 0,
      add(n: number) {
        this.total += n;
        return this;
      },
    },
    log,
  );
  calc.add(5);
  console.log("esperado: 5 | obtido:", calc.total);
  console.log(
    'esperado: get "add", call "add" [ 5 ], get "total", set "total" 5, get "total" | obtido:',
    log,
  );
});

if (failures > 0) {
  console.log(`\n${failures} seção(ões) falharam.`);
  Deno.exitCode = 1;
}
