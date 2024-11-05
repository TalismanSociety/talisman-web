export function sortTokenPickerAssets<T extends { token: { originSymbol: string }; chain: { name: string } }>(
  a: T,
  b: T
): number {
  if (a.token.originSymbol !== b.token.originSymbol) return a.token.originSymbol.localeCompare(b.token.originSymbol)
  if (a.chain.name !== b.chain.name) return a.chain.name.localeCompare(b.chain.name)
  return 0
}
