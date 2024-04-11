import { useEffect, useState } from 'react'

export type Dapp = { id: string; name: string; description: string; logoUrl: string; tags: string[] }

export const useFetchDapps = () => {
  const [dapps, setDapps] = useState<Dapp[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | unknown>(undefined)
  const [tags, setTags] = useState<string[]>(['All', '⭐ Featured']) // Hardcoded Featured for now so it appears first.

  useEffect(() => {
    const fetchDapps = async () => {
      try {
        void fetch(`https://api.baserow.io/api/database/rows/table/141541/?user_field_names=true`, {
          method: 'GET',
          headers: {
            Authorization: `Token ${import.meta.env.REACT_APP_BASEROW_EXPLORE_AUTH}`,
          },
        })
          .then(async res => await res.json())
          .then((data: { results: any[] }) => {
            // Define a type for each item
            const items = data?.results
              .map((item: any) => {
                if (!item.name || !item.url || !item.logo?.[0]?.url) {
                  return undefined
                }

                return {
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  url: item.url,
                  tags: item.tags?.map((tag: any) => tag.value) ?? [],
                  envs: item.envs,
                  score: item.score,
                  logoUrl: item.logo[0].url,
                }
              })
              .filter(item => item !== undefined)

            setTags(prevTags =>
              Array.from(new Set<string>([...prevTags, ...items.flatMap(item => item?.tags)])).sort((a, b) => {
                if (a.match(/^other$/i)) return 1
                if (b.match(/^other$/i)) return -1
                return 0
              })
            )

            const sortedItems = items.slice().sort((a: any, b: any) => {
              if (a.tags.includes('⭐ Featured') && b.tags.includes('⭐ Featured')) {
                return b.score - a.score
              } else if (a.tags.includes('⭐ Featured')) {
                return -1
              } else if (b.tags.includes('⭐ Featured')) {
                return 1
              } else {
                return b.score - a.score
              }
            }) as Dapp[]

            setDapps(sortedItems)
            setLoading(false)
          })
      } catch (error: unknown) {
        setError(error)
      }
    }

    void fetchDapps()
  }, [])

  return { dapps, loading, error, tags }
}
