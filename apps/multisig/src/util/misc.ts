import { Chain } from '@domains/chains'

export function arrayIntersection<T>(arr1: T[], arr2: T[]): T[] {
  let set = new Set(arr2)
  return arr1.filter(item => set.has(item))
}

export function makeTransactionID(chain: Chain, timepointHeight: number, timepointIndex: number): string {
  return `${chain.squidIds.chainData}-${timepointHeight}-${timepointIndex}`
}
