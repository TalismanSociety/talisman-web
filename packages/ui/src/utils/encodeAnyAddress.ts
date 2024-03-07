import { encodeAddress, ethereumEncode, isEthereumAddress } from '@polkadot/util-crypto'

export const encodeAnyAddress = (key: string, ss58Format?: number | undefined) => {
  if (typeof key === 'string' && isEthereumAddress(key)) {
    return { type: 'ethereum', address: ethereumEncode(key) } as const
  }

  try {
    return { type: 'substrate', address: encodeAddress(key, ss58Format) } as const
  } catch {}

  return { type: undefined, address: key } as const
}
