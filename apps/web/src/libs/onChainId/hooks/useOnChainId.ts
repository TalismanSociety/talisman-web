import { useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { lookupAddressFamily } from '../atoms/onChainIdResolver'
import { useEffect } from 'react'

export const useOnChainId = (address?: string) => {
  const cached = address ? onChainIdsCache.get(address)?.onChainId ?? null : null

  const result = useAtomValue(loadable(lookupAddressFamily(address)))
  const live = (address && result?.state === 'hasData' && result.data?.get(address)) || null

  useEffect(() => {
    if (!address) return
    if (result?.state !== 'hasData') return

    if (live === null) onChainIdsCache.delete(address)
    else onChainIdsCache.set(address, { onChainId: live, updated: Date.now() })

    // persist cache to local storage
    persistOnChainIdsCache()
  }, [address, result, live])

  const onChainId = live ?? cached ?? null

  return [onChainId] as const
}

const cacheKey = 'talisman-on-chain-ids-cache'
const persistItemDuration = 15_778_476_000 // 6 months in milliseconds
const onChainIdsCache = new Map<string, { onChainId?: string | null; updated?: number }>(
  JSON.parse(localStorage.getItem(cacheKey) ?? '[]')
)
const persistOnChainIdsCache = () =>
  localStorage.setItem(
    cacheKey,
    JSON.stringify(
      Array.from(onChainIdsCache.entries())
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
