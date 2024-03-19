import type { NsLookupType } from '@talismn/on-chain-id'
import { isPotentialAzns, isPotentialEns } from '@talismn/on-chain-id'
import { isEthereumAddress } from '@talismn/util'
import { useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { useEffect, useState } from 'react'
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

  const cachedResult = isNsLookup && name ? nsNamesCache.get(name)?.result ?? null : null
  const cached = Array.isArray(cachedResult) && cachedResult[0] && cachedResult[1] ? cachedResult : null

  const result = useAtomValue(loadable(resolveNsNameFamily(isNsLookup ? name : undefined)))
  const live = (name && result?.state === 'hasData' && result?.data?.get(name)) || null

  const isNsFetching = result.state === 'loading'

  useEffect(() => {
    if (!name) return
    if (result?.state !== 'hasData') return

    if (live === null) nsNamesCache.delete(name)
    else nsNamesCache.set(name, { result: live, updated: Date.now() })

    // persist cache to local storage
    persistNsNamesCache()
  }, [name, result, live])

  const [address, nsLookupType] = live ?? cached ?? [null, null]

  return [address, { isNsLookup, nsLookupType, isNsFetching }] as const
}

const cacheKey = 'TalismanNsNamesCache'
const persistItemDuration = 15_778_476_000 // 6 months in milliseconds
const nsNamesCache = new Map<string, { result?: [string, NsLookupType] | null; updated?: number }>(
  JSON.parse(localStorage.getItem(cacheKey) ?? '[]')
)
const persistNsNamesCache = () =>
  localStorage.setItem(
    cacheKey,
    JSON.stringify(
      Array.from(nsNamesCache.entries())
        // remove cached items which haven't been seen in a while
        .filter(
          ([, item]) =>
            // check that the updated field exists
            item?.updated &&
            // check that the item has been updated within the persistItemDuration
            Date.now() - item.updated <= persistItemDuration
        )
    )
  )
