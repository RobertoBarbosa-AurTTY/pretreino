/**
 * Fundamentos 05: Prototypes
 *
 * Part 1: re-implement Object.create, instanceof, new and inheritance.
 * Part 2: build the same Animal/Dog hierarchy twice — with constructor
 * functions + prototypes, and with `class`.
 * Read the README first.
 */

// deno-lint-ignore ban-types
export type AnyFunction = Function;

// ---------------------------------------------------------------------------
// Part 1: the primitives
// ---------------------------------------------------------------------------

/**
 * Like `Object.create(proto)` followed by copying `props` as own properties.
 * Do NOT use `Object.create`.
 */
export function createObject<
  P extends object | null,
  T extends object = object,
>(
  proto: P,
  props?: T,
): T {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Like `obj instanceof Ctor`, walking the prototype chain by hand.
 * Do NOT use `instanceof` nor `isPrototypeOf`.
 */
export function myInstanceOf(obj: unknown, Ctor: AnyFunction): boolean {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Like `new Ctor(...args)` for plain constructor functions.
 * Do NOT use `new` nor `Reflect.construct`.
 */
export function myNew<T extends object, A extends unknown[]>(
  Ctor: (this: T, ...args: A) => unknown,
  ...args: A
): T {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Makes instances of `Child` inherit from `Parent.prototype`, keeps
 * `Child.prototype.constructor === Child`, and makes static members of
 * `Parent` reachable from `Child`. Without `class`/`extends`.
 */
export function inherit(Child: AnyFunction, Parent: AnyFunction): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Returns the constructor name of every object in `obj`'s prototype chain,
 * starting at `Object.getPrototypeOf(obj)` and ending at `Object.prototype`.
 * Example for a Dog: ["Dog", "Animal", "Object"].
 */
export function getPrototypeChain(obj: object): string[] {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Returns the object in `obj`'s chain (including `obj` itself) that OWNS
 * `key`, or `null` if no object in the chain has it.
 */
export function findPropertyOwner(
  obj: object,
  key: PropertyKey,
): object | null {
  // TODO: Implement
  throw new Error("Not implemented");
}

// ---------------------------------------------------------------------------
// Part 2a: Animal / Dog with constructor functions + prototypes
// ---------------------------------------------------------------------------

export interface AnimalInstance {
  name: string;
  speak(): string;
  describe(): string;
}

export interface DogInstance extends AnimalInstance {
  breed: string;
  fetch(): string;
}

/** Sets `this.name`. Methods live on `Animal.prototype`, not on the instance. */
export function Animal(this: AnimalInstance, name: string): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

/** Must return `${name} faz um som.` */
Animal.prototype.speak = function (this: AnimalInstance): string {
  // TODO: Implement
  throw new Error("Not implemented");
};

/** Must return `${name} (${constructor name})`, e.g. "Rex (Dog)". */
Animal.prototype.describe = function (this: AnimalInstance): string {
  // TODO: Implement
  throw new Error("Not implemented");
};

/** Must call `Animal` for `name` (reusing it), then set `this.breed`. */
export function Dog(this: DogInstance, name: string, breed: string): void {
  // TODO: Implement
  throw new Error("Not implemented");
}

// TODO: call `inherit(Dog, Animal)` HERE, before the Dog.prototype methods
// below are defined (think about why the order matters).

/** Overrides Animal's speak: must return `${name} late: au au!`. */
Dog.prototype.speak = function (this: DogInstance): string {
  // TODO: Implement
  throw new Error("Not implemented");
};

/** Must return `${name} (${breed}) buscou a bolinha.` */
Dog.prototype.fetch = function (this: DogInstance): string {
  // TODO: Implement
  throw new Error("Not implemented");
};

// ---------------------------------------------------------------------------
// Part 2b: the same hierarchy with `class`
// ---------------------------------------------------------------------------

export class AnimalClass implements AnimalInstance {
  name: string;

  constructor(name: string) {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Same contract as Animal.prototype.speak. */
  speak(): string {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Same contract as Animal.prototype.describe. */
  describe(): string {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Static member, must also be reachable as `DogClass.create(...)`. */
  static create(name: string): AnimalClass {
    // TODO: Implement
    throw new Error("Not implemented");
  }
}

export class DogClass extends AnimalClass implements DogInstance {
  breed: string;

  constructor(name: string, breed: string) {
    // TODO: Implement
    super(name);
    throw new Error("Not implemented");
  }

  /** Same contract as Dog.prototype.speak. */
  override speak(): string {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /** Same contract as Dog.prototype.fetch. */
  fetch(): string {
    // TODO: Implement
    throw new Error("Not implemented");
  }
}
