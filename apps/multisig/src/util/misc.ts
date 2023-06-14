export function arrayIntersection<T>(arr1: T[], arr2: T[]): T[] {
  let set = new Set(arr2)
  return arr1.filter(item => set.has(item))
}
