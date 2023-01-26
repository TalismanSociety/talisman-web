import { chainApiState } from '@domains/chains/recoils'
import { find } from 'lodash'
import { PropsWithChildren, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

import { ParachainDetails, parachainDetails } from './util/_config'

export type { ParachainDetails } from './util/_config'

export const useParachainsDetails = () => useContext()
export const useParachainsDetailsIndexedById = () => {
  const { parachains, hydrated } = useParachainsDetails()

  return {
    parachains: useMemo(() => Object.fromEntries(parachains.map(parachain => [parachain.id, parachain])), [parachains]),
    hydrated,
  }
}

export const useParachainDetailsById = (id?: number | string) => useFindParachainDetails('id', id)
export const useParachainDetailsBySlug = (slug?: string) => useFindParachainDetails('slug', slug)

export const useParachainAssets = (
  id?: string
): Partial<{ [key: string]: string; banner: string; card: string; logo: string }> => {
  const crowdloanDetail = parachainDetails.find(x => x.id === id)
  const slug = crowdloanDetail?.slug

  return {
    banner: `https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/promo/${slug}-banner.png`,
    card: `https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/promo/${slug}-card.png`,
    logo: `https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/${slug}.svg`,
  }
}

//
// Hooks (internal)
//

export const useFindParachainDetails = (
  key: string,
  value: any
): Partial<{ parachainDetails?: ParachainDetails; hydrated: boolean }> => {
  const { parachains, hydrated } = useParachainsDetails()

  const parachainDetails = useMemo(() => find(parachains, { [key]: value }), [parachains, key, value])

  return {
    parachainDetails,
    hydrated,
  }
}

//
// Context
//

type ContextProps = {
  parachains: ParachainDetails[]
  hydrated: boolean
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The parachain provider is required in order to use this hook')

  return context
}

//
// Provider
//

export const Provider = ({ children }: PropsWithChildren) => {
  const [hydrated, setHydrated] = useState(false)
  const [parachains, setParachains] = useState<ParachainDetails[]>([])

  const apisLoadable = useRecoilValueLoadable(waitForAll([chainApiState('polkadot'), chainApiState('kusama')]))

  useEffect(
    () => {
      if (hydrated) {
        return
      }

      if (apisLoadable.state !== 'hasValue') {
        return
      }

      ;(async () => {
        const [polkadotApi, kusamaApi] = apisLoadable.contents

        const polkadotFunds = await polkadotApi.query.crowdloan.funds.entries()
        const kusamaFunds = await kusamaApi.query.crowdloan.funds.entries()

        const polkadotParaIds = polkadotFunds.map(x => `0-${x[0].args[0]}`)
        const kusamaParaIds = kusamaFunds.map(x => `2-${x[0].args[0]}`)

        const paraIds = [...polkadotParaIds, ...kusamaParaIds]

        setParachains(parachainDetails.filter(x => paraIds.includes(x.id)))
        setHydrated(true)
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apisLoadable.state]
  )

  return <Context.Provider value={{ parachains, hydrated }}>{children}</Context.Provider>
}
