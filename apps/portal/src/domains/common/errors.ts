export class HarmlessError extends Error {
  constructor(cause: unknown) {
    const message =
      typeof cause === 'string'
        ? cause
        : typeof cause === 'object' && cause !== null && 'message' in cause && typeof cause.message === 'string'
        ? cause.message
        : undefined

    super(message, { cause })
  }
}
