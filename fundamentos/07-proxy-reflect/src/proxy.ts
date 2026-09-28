/**
 * Fundamentos 07 — Proxy & Reflect
 *
 * Implemente cada função usando `new Proxy(target, handler)` e, dentro das
 * traps, `Reflect.*` para executar o comportamento padrão.
 */

/** Informação enviada a `onChange` a cada mudança. */
export interface ChangeEvent {
  /** Caminho da propriedade alterada, ex.: `["user", "address", "city"]`. */
  path: PropertyKey[];
  oldValue: unknown;
  newValue: unknown;
  /** `"set"` para atribuição, `"delete"` para `delete obj.prop`. */
  type: "set" | "delete";
}

/**
 * Devolve uma versão observável de `obj`.
 *
 * - Chama `onChange` em toda atribuição e todo `delete`, com o caminho completo
 * - É PROFUNDA: `state.user.address.city = "X"` também notifica, com
 *   `path = ["user", "address", "city"]`
 * - Não notifica quando o novo valor é idêntico ao antigo (`Object.is`)
 * - Acessar a mesma propriedade aninhada duas vezes devolve o MESMO proxy
 *   (`state.user === state.user`)
 * - Funciona com arrays (`state.list.push(4)` notifica)
 */
export function reactive<T extends object>(
  obj: T,
  onChange: (event: ChangeEvent) => void,
): T {
  // TODO: Implement
  throw new Error("Not implemented");
}

/** Erro lançado ao tentar alterar um objeto `readonly`. */
export class ReadonlyError extends Error {
  constructor(public readonly property: PropertyKey) {
    super(`Cannot modify readonly property "${String(property)}"`);
    this.name = "ReadonlyError";
  }
}

/**
 * Devolve uma visão somente-leitura (profunda) de `obj`.
 *
 * - `set`, `deleteProperty` e `defineProperty` lançam `ReadonlyError`
 *   (em qualquer nível de profundidade)
 * - Leituras funcionam normalmente
 * - O objeto original continua mutável, e mudanças nele aparecem na visão
 */
export function readonly<T extends object>(obj: T): Readonly<T> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Leitura de propriedade inexistente devolve o valor de `fallback`.
 *
 * - Propriedades que EXISTEM em `obj` (mesmo com valor `undefined`) não usam o
 *   fallback
 * - `"prop" in proxy` é `true` se a prop existe em `obj` OU em `fallback`
 * - Escritas vão para `obj`, nunca para `fallback`
 */
export function withDefaults<T extends object, D extends object>(
  obj: T,
  fallback: D,
): T & D {
  // TODO: Implement
  throw new Error("Not implemented");
}

/** Validador de uma propriedade: devolve `true` ou uma mensagem de erro. */
export type Validator = (value: unknown) => true | string;

/** Erro lançado quando uma atribuição não passa na validação. */
export class ValidationError extends Error {
  constructor(public readonly property: PropertyKey, message: string) {
    super(`Invalid value for "${String(property)}": ${message}`);
    this.name = "ValidationError";
  }
}

/**
 * Proxy que valida cada atribuição com o validador correspondente em `schema`.
 *
 * - Validação falhou → lança `ValidationError` e o valor NÃO é gravado
 * - Propriedade sem validador em `schema` → lança `ValidationError`
 *   ("unknown property")
 * - Os valores iniciais de `obj` também devem ser validados na criação
 */
export function validated<T extends object>(
  obj: T,
  schema: { [K in keyof T]: Validator },
): T {
  // TODO: Implement
  throw new Error("Not implemented");
}

/** Uma operação registrada pelo proxy de log. */
export type LogEntry =
  | { op: "get"; property: PropertyKey }
  | { op: "set"; property: PropertyKey; value: unknown }
  | { op: "delete"; property: PropertyKey }
  | { op: "has"; property: PropertyKey }
  | { op: "call"; property: PropertyKey; args: unknown[] };

/**
 * Registra toda interação com `obj` em `log`.
 *
 * - `get`, `set`, `deleteProperty` e `has` geram entradas
 * - Quando a propriedade lida é uma função, chamar o retorno registra
 *   `{ op: "call", property, args }` (além do `get`) ANTES de executar a função
 *   com `this` correto (o proxy)
 * - Chaves `symbol` NÃO devem ser registradas (evita ruído de
 *   `Symbol.toPrimitive`, `Symbol.iterator` etc.)
 */
export function createLoggingProxy<T extends object>(
  obj: T,
  log: LogEntry[],
): T {
  // TODO: Implement
  throw new Error("Not implemented");
}
