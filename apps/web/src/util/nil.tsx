export const isNilOrWhitespace = (value: string | undefined | null): value is undefined | null =>
  (value?.trim() ?? '') === ''
