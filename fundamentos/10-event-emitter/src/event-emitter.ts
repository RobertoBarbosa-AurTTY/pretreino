/**
 * Fundamentos 10 — Event Emitter
 *
 * Implemente um EventEmitter tipado, no estilo do `node:events`, e o helper
 * `waitFor`. Não importe `node:events` nem `EventTarget`.
 */

/** Mapa de eventos: nome do evento → tupla de argumentos do listener. */
export type EventMap = Record<string, unknown[]>;

/** Listener de um evento específico. */
export type Listener<Args extends unknown[]> = (...args: Args) => void;

/** Número padrão de listeners por evento antes do aviso. */
export const DEFAULT_MAX_LISTENERS = 10;

/**
 * EventEmitter tipado.
 *
 * ```ts
 * type Events = { message: [text: string, from: string]; close: [] };
 * const bus = new EventEmitter<Events>();
 * bus.on("message", (text, from) => {}); // text: string, from: string
 * ```
 *
 * Regras:
 * - Listeners são chamados SINCRONAMENTE, na ordem em que foram registrados
 * - Um listener adicionado/removido DURANTE um `emit` não afeta aquele `emit`
 *   (itere sobre uma cópia)
 * - O mesmo listener registrado duas vezes é chamado duas vezes
 * - Evento `"error"` sem nenhum listener: `emit("error", err)` LANÇA `err`
 *   (se `err` não for `Error`, lança um `Error` que o descreva)
 * - Ao passar de `maxListeners` listeners num mesmo evento, chama
 *   `console.warn` UMA vez por evento (0 = sem limite)
 */
export class EventEmitter<Events extends EventMap> {
  constructor(options?: { maxListeners?: number }) {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Registra um listener. Devolve `this` para encadear. */
  on<E extends keyof Events & string>(
    event: E,
    listener: Listener<Events[E]>,
  ): this {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Registra um listener que roda no máximo UMA vez.
   * `off(event, listener)` com o listener ORIGINAL também deve removê-lo.
   */
  once<E extends keyof Events & string>(
    event: E,
    listener: Listener<Events[E]>,
  ): this {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Remove UMA ocorrência do listener (a última registrada). Devolve `this`. */
  off<E extends keyof Events & string>(
    event: E,
    listener: Listener<Events[E]>,
  ): this {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Chama os listeners do evento com `args`.
   * Devolve `true` se havia pelo menos um listener, `false` caso contrário.
   */
  emit<E extends keyof Events & string>(event: E, ...args: Events[E]): boolean {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Quantidade de listeners registrados para o evento. */
  listenerCount<E extends keyof Events & string>(event: E): number {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Remove todos os listeners do evento, ou de TODOS os eventos se omitido. */
  removeAllListeners<E extends keyof Events & string>(event?: E): this {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Altera o limite de listeners por evento (0 = sem limite). */
  setMaxListeners(n: number): this {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Nomes dos eventos que têm pelo menos um listener. */
  eventNames(): (keyof Events & string)[] {
    // TODO: Implement
    throw new Error("Not implemented");
  }
}

/** Erro lançado por `waitFor` quando o tempo esgota. */
export class TimeoutError extends Error {
  constructor(
    public readonly event: string,
    public readonly timeoutMs: number,
  ) {
    super(`Timed out after ${timeoutMs}ms waiting for "${event}"`);
    this.name = "TimeoutError";
  }
}

/**
 * Espera o próximo `event` e resolve com a tupla de argumentos.
 *
 * - Rejeita com `TimeoutError` se `timeoutMs` passar (sem timeout se omitido)
 * - Se `event !== "error"` e o emitter emitir `"error"` antes, rejeita com o
 *   erro recebido
 * - Rejeita se `signal` for abortado (com `signal.reason`)
 * - Em QUALQUER desfecho, remove os listeners que registrou e limpa o timer
 *   (nada pode vazar — veja o Fundamentos 08)
 */
export function waitFor<
  Events extends EventMap,
  E extends keyof Events & string,
>(
  emitter: EventEmitter<Events>,
  event: E,
  options?: { timeoutMs?: number; signal?: AbortSignal },
): Promise<Events[E]> {
  // TODO: Implement
  throw new Error("Not implemented");
}
