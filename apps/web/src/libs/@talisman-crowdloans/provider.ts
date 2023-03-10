import { selector } from 'recoil'

export type ParachainDetail = {
  id: string
  name: string
  image?: string
  headerImage?: string
  token: string
  slug: string
  relayId: string
  paraId: string
  subtitle: string
  info: string
  links: {
    discord?: string
    element?: string
    github?: string
    linkedin?: string
    medium?: string
    reddit?: string
    telegram?: string
    twitter?: string
    website?: string
    youtube?: string
  }
  customRewards?: {
    title: string
    value: string
  }[]
  bonus: {
    full?: string
    info?: string
    short?: string
  }
}

const crowdloanDataState = selector<ParachainDetail[]>({
  key: 'CrowdloanData',
  get: async ({ get }) => {
    const response = await fetch(`https://api.baserow.io/api/database/rows/table/146542/?user_field_names=true`, {
      method: 'GET',
      headers: {
        Authorization: `Token R09w2cI9DromULZxRpBlTM7xqjhIkhMp`,
      },
    })
    const data = await response.json()
    const crowdloans = data?.results?.map((crowdloan: any) => {
      const links: { [key: string]: string } = {}
      for (const key in crowdloan) {
        if (key.startsWith('links.')) {
          const value = crowdloan[key]
          if (value) {
            // check if value is not empty
            const newKey = key
              .replace(/^links\./, '')
              .replace(/-(\w)/g, (_, c) => c.toUpperCase())
              .toLowerCase()
            links[newKey] = value
          }
        }
      }

      const customRewards = []
      for (let i = 0; ; i++) {
        const titleKey = `rewards.custom.${i}.title`
        const valueKey = `rewards.custom.${i}.value`
        if (!crowdloan[titleKey] && !crowdloan[valueKey]) {
          // Exit loop if both title and value are null or undefined
          break
        }
        // Skip iteration if either title or value is null or undefined
        if (!crowdloan[titleKey] || !crowdloan[valueKey]) {
          continue
        }
        customRewards.push({
          title: crowdloan[titleKey],
          value: crowdloan[valueKey],
        })
      }

      return {
        id: crowdloan?.crowdloanId,
        name: crowdloan?.name,
        token: crowdloan?.token,
        slug: crowdloan?.slug,
        relayId: crowdloan?.relayId,
        paraId: crowdloan?.paraId,
        subtitle: crowdloan?.subtitle,
        info: crowdloan?.info,
        links,
        image: crowdloan?.image[0],
        headerImage: crowdloan?.headerImage[0],
        customRewards,
        rewards: {
          token: crowdloan?.['rewards.token'],
          info: crowdloan?.['rewards.info'],
        },
        bonus: {
          short: crowdloan?.['bonus.short'],
          full: crowdloan?.['bonus.full'],
          info: crowdloan?.['bonus.info'],
        },
      } as ParachainDetail
    })

    return crowdloans
  },
})

export default crowdloanDataState
