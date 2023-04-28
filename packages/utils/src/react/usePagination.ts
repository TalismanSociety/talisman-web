import { useState, useEffect, useMemo, useCallback, type DependencyList } from 'react'

export const usePagination = <T>(items: T[], { limit }: { limit: number }, deps?: DependencyList) => {
  const [offset, setOffset] = useState(0)

  useEffect(() => setOffset(0), deps ?? [items])

  const pageCount = Math.ceil(items.length / limit)
  const page = (offset + limit) / limit - 1
  const paginatedItems = useMemo(() => items.slice(offset, offset + limit), [items, offset, limit])

  const next = useCallback(() => setOffset(x => x + limit), [limit])
  const previous = useCallback(() => setOffset(x => x - limit), [limit])

  return [
    paginatedItems,
    {
      page,
      pageCount,
      previous: offset <= 0 ? undefined : previous,
      next: offset + limit >= items.length - 1 ? undefined : next,
    },
  ] as const
}
