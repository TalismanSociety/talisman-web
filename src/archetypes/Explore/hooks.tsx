import { useEffect, useState } from 'react'

interface Dapp {
  [key: string]: any
}

export const useFetchDapps = () => {
  const [dapps, setDapps] = useState<Dapp>([])
  const [loading, setLoading] = useState<Boolean>(true)
  const [error, setError] = useState<String | null>(null)
  const [tags, setTags] = useState<string[]>(['All', '⭐ Featured']) // Hardcoded Featured for now so it appears first.

  useEffect(() => {
    const fetchDapps = async () => {
      try {
        fetch('https://api.airtable.com/v0/appBz0V1T1R760dRE/Dapps?api_key=key34AypYHAb59vGf')
          .then(res => res.json())
          .then(data => {
            // Define a type for each item
            const items = data.records
              .map((item: any) => {
                if (!item.fields.name || !item.fields.url) {
                  console.log('data err - ' + item.fields.name)
                  return null
                }

                if (!item.fields.logo) {
                  console.log('logo err - ' + item.fields.name)
                  return null
                }

                return {
                  id: item.id,
                  name: item.fields.name,
                  description: item.fields.description,
                  url: item.fields.url,
                  tags: item.fields.tags || [],
                  envs: item.fields.envs,
                  score: item.fields.score,
                  logoUrl: item.fields.logo[0].url,
                }
              })
              .filter((item: any) => item !== null)
              .filter((item: any) => {
                // Store all the item.tags in a dictionary
                if (item.tags) {
                  item.tags.forEach((tag: string) => {
                    setTags(prev => (!prev.includes(tag) ? [...prev, tag] : prev))
                  })
                }

                return item
              })

            items.sort((a: any, b: any) => {
              if (a.tags.includes('⭐ Featured') && b.tags.includes('⭐ Featured')) {
                return b.score - a.score
              } else if (a.tags.includes('⭐ Featured')) {
                return -1
              } else if (b.tags.includes('⭐ Featured')) {
                return 1
              } else {
                return b.score - a.score
              }
            })

            setDapps(items)
            setLoading(false)
          })
      } catch (error: any) {
        setError(error.toString())
      }
    }

    fetchDapps()
  }, [])

  return { dapps, loading, error, tags }
}
