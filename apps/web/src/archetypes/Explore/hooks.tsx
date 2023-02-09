import { useEffect, useState } from 'react'

export interface Dapp {
  [key: string]: any
}

export const useFetchDapps = () => {
  const [dapps, setDapps] = useState<Dapp[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | unknown>(undefined)
  const [tags, setTags] = useState<string[]>(['All', '⭐ Featured']) // Hardcoded Featured for now so it appears first.

  useEffect(() => {
    const fetchDapps = async () => {
      try {
        fetch(`https://api.airtable.com/v0/appBz0V1T1R760dRE/Dapps?api_key=${process.env.REACT_APP_AIR_TABLE_API_KEY}`)
          .then(res => res.json())
          .then((data: { records: any[] }) => {
            // Define a type for each item
            const items = data.records
              .map((item: any) => {
                if (!item.fields.name || !item.fields.url) {
                  console.log('data err - ' + item.fields.name)
                  return undefined
                }

                if (!item.fields.logo) {
                  console.log('logo err - ' + item.fields.name)
                  return undefined
                }

                return {
                  id: item.id,
                  name: item.fields.name,
                  description: item.fields.description,
                  url: item.fields.url,
                  tags: item.fields.tags ?? [],
                  envs: item.fields.envs,
                  score: item.fields.score,
                  logoUrl: item.fields.logo[0].url,
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

    fetchDapps()
  }, [])

  return { dapps, loading, error, tags }
}
