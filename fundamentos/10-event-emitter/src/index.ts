/**
 * Fundamentos 10: Event Emitter — playground
 *
 * Run with `deno task dev` and compare "esperado" vs "obtido" by eye.
 */

import { EventEmitter, TimeoutError, waitFor } from "./event-emitter.ts";

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

type OrderEvents = {
  created: [orderId: string, total: number];
  paid: [orderId: string];
  error: [error: Error];
};

await section("on / emit / once / off / removeAllListeners", () => {
  const bus = new EventEmitter<OrderEvents>();

  // on / emit / ordem
  const calls: string[] = [];
  bus.on("created", (id, total) => calls.push(`A:${id}:${total}`));
  bus.on("created", (id) => calls.push(`B:${id}`));
  console.log("esperado: true | obtido:", bus.emit("created", "p1", 99.9));
  console.log('esperado: [ "A:p1:99.9", "B:p1" ] | obtido:', calls);
  console.log(
    "esperado: false (sem listeners) | obtido:",
    bus.emit("paid", "p1"),
  );
  console.log("esperado: 2 | obtido:", bus.listenerCount("created"));

  // once / off
  let onceCalls = 0;
  bus.once("paid", () => onceCalls++);
  bus.emit("paid", "p1");
  bus.emit("paid", "p2");
  console.log("esperado: 1 | obtido:", onceCalls);

  const removable = () => onceCalls += 100;
  bus.once("paid", removable);
  bus.off("paid", removable); // off com o listener ORIGINAL
  bus.emit("paid", "p3");
  console.log("esperado: 1 (removido antes de rodar) | obtido:", onceCalls);

  // mudanças durante o emit
  const snapshot: string[] = [];
  const late = () => snapshot.push("late");
  bus.on("paid", () => {
    snapshot.push("first");
    bus.on("paid", late);
  });
  bus.emit("paid", "p4");
  console.log(
    'esperado: [ "first" ] (late não roda neste emit) | obtido:',
    snapshot,
  );

  // removeAllListeners / eventNames
  console.log('esperado: [ "created", "paid" ] | obtido:', bus.eventNames());
  bus.removeAllListeners("created");
  console.log('esperado: [ "paid" ] | obtido:', bus.eventNames());
  bus.removeAllListeners();
  console.log("esperado: [] | obtido:", bus.eventNames());
});

await section("evento error", () => {
  const noErrorListener = new EventEmitter<OrderEvents>();
  try {
    noErrorListener.emit("error", new Error("falha no pagamento"));
    console.log("esperado: lançar | obtido: não lançou");
  } catch (e) {
    console.log(
      "esperado: falha no pagamento | obtido:",
      (e as Error).message,
    );
  }
});

await section("maxListeners (deve aparecer UM aviso abaixo)", () => {
  const small = new EventEmitter<OrderEvents>({ maxListeners: 2 });
  for (let i = 0; i < 4; i++) small.on("paid", () => {});
  console.log("esperado: 4 | obtido:", small.listenerCount("paid"));
});

await section("waitFor", async () => {
  const orders = new EventEmitter<OrderEvents>();
  setTimeout(() => orders.emit("created", "p9", 10), 20);
  const args = await waitFor(orders, "created", { timeoutMs: 500 });
  console.log('esperado: [ "p9", 10 ] | obtido:', args);
  console.log(
    "esperado: 0 (limpou os listeners) | obtido:",
    orders.listenerCount("created"),
  );

  try {
    await waitFor(orders, "paid", { timeoutMs: 30 });
    console.log("esperado: TimeoutError | obtido: resolveu");
  } catch (e) {
    console.log(
      "esperado: TimeoutError true | obtido:",
      (e as Error).name,
      e instanceof TimeoutError,
    );
  }
  console.log(
    "esperado: 0 0 (nada vazou) | obtido:",
    orders.listenerCount("paid"),
    orders.listenerCount("error"),
  );

  setTimeout(() => orders.emit("error", new Error("gateway fora do ar")), 10);
  try {
    await waitFor(orders, "paid", { timeoutMs: 500 });
    console.log("esperado: rejeitar | obtido: resolveu");
  } catch (e) {
    console.log(
      "esperado: gateway fora do ar | obtido:",
      (e as Error).message,
    );
  }
});

if (failures > 0) {
  console.log(`\n${failures} seção(ões) falharam.`);
  Deno.exitCode = 1;
}
