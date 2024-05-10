import { isAddress as baseIsSubstrateAddress } from '@polkadot/util-crypto'

export const shortenAddress = (address: string, padding = 4) =>
  `${address.slice(0, padding)}...${address.slice(-padding)}`

/**
 * This is needed cuz `isAddress` from `@polkadot/util-crypto` is broken af
 */
export const isSubstrateAddress = (address: string) => !address.startsWith('0x') && baseIsSubstrateAddress(address)

export const sleep = async (ms: number) => await new Promise<void>(resolve => setTimeout(() => resolve(), ms))
