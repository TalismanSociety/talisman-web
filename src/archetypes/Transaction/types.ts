// todo
// any any types here

export type TTransaction = {
  id: string
  order: string
  chainId: string
  blockNumber: bigint
  createdAt: Date
  section: string
  method: string
  relatedAddresses: string[]
}
