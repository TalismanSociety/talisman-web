import { isPotentialAzns, isPotentialEns } from '@talismn/on-chain-id'
import { isEthereumAddress } from '@talismn/util'
import { useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { useState } from 'react'
import { useDebounce } from 'react-use'
import { resolveNsNameFamily } from '../atoms/onChainIdResolver'

export type Options = {
  /** Enabled by default, set to false to disable */
  ens?: boolean

  /** Enabled by default, set to false to disable */
  azns?: boolean
}

/**
 * Use this hook to resolve a string like `0xkheops.eth` or `talisman.azero` to an address.
 */
export const useResolveNsName = (resolveName?: string, options?: Options) => {
  const useEns = options?.ens !== false
  const useAzns = options?.azns !== false

  const [name, setName] = useState(resolveName)
  useDebounce(() => setName(resolveName), 750, [resolveName])

  // check if name is something we can look up
  const nsLookupName =
    // don't look up undefined
    name !== undefined &&
    // don't look up ethereum addresses
    !isEthereumAddress(name) &&
    // only look up potential ns names
    ((useEns && isPotentialEns(name)) || (useAzns && isPotentialAzns(name)))
      ? name
      : undefined

  // let caller detect if we're going to look name up or not
  const isNsLookup = nsLookupName !== undefined

  const result = useAtomValue(loadable(resolveNsNameFamily(isNsLookup ? name : undefined)))
  const live = (name && result?.state === 'hasData' && result?.data?.get(name)) || null

  const isNsFetching = result.state === 'loading'

  const [address, nsLookupType] = live ?? [null, null]

  return [address, { isNsLookup, nsLookupType, isNsFetching }] as const
}
