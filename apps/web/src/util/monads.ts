/**
 * Minimal implementation of a Maybe monad
 * loosely based on https://github.com/patrickmichalina/typescript-monads/blob/master/src/maybe/maybe.ts
 */
export class Maybe<T> {
  #value: T | undefined | null
  #isNone = false

  constructor(value?: T | null) {
    this.#value = value
    this.#isNone = value === null || value === undefined
  }

  static of<T>(value?: T) {
    return new Maybe(value)
  }

  static ofFalsy<T>(value?: T) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return new Maybe(value || undefined)
  }

  get isSome() {
    return !this.#isNone
  }

  valueOr<U>(defaultValue: U): T | U {
    if (this.isSome) {
      return this.#value as NonNullable<T>
    }

    return defaultValue
  }

  map<U>(fn: (value: NonNullable<T>) => U) {
    if (this.isSome) {
      return Maybe.of(fn(this.#value as NonNullable<T>))
    }

    return new Maybe<U>(undefined)
  }

  mapOr<U>(defaultValue: U, fn: (value: NonNullable<T>) => U): U {
    if (this.isSome) {
      return fn(this.#value as NonNullable<T>)
    }

    return defaultValue
  }

  mapOrUndefined<U>(fn: (value: NonNullable<T>) => U): U | undefined {
    return this.mapOr(undefined, fn)
  }

  mapOrNull<U>(fn: (value: NonNullable<T>) => U): U | null {
    return this.mapOr(null, fn)
  }
}
