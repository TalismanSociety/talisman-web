export type Account = { name?: string; readonly?: boolean } & (
  | {
      type: 'evm'
      address: `0x${string}`
    }
  | { type: 'substrate'; address: string }
)
