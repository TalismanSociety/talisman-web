import { useState, useEffect, useMemo, useCallback, type DependencyList } from 'react'

export const usePagination = <T>(items: readonly T[], { limit }: { limit: number }, deps?: DependencyList) => {
  const [offset, setOffset] = useState(0)

  useEffect(() => setOffset(0), deps ?? [items])

  const pageCount = Math.ceil(items.length / limit)
  const page = Math.ceil(offset / limit)
  const paginatedItems = useMemo(() => items.slice(offset, offset + limit), [items, offset, limit])

  const next = useCallback(() => setOffset(x => x + limit), [limit])
  const previous = useCallback(() => setOffset(x => x - limit), [limit])

  return [
    paginatedItems,
    {
      page,
      pageCount,
      previous: page <= 0 ? undefined : previous,
      next: page >= pageCount - 1 ? undefined : next,
    },
  ] as const
}
