export function validPrefix(prefix?: number) {
  if (prefix === undefined || prefix < 0 || prefix > 16383 || [46, 47].includes(prefix)) return 42
  return prefix
}
