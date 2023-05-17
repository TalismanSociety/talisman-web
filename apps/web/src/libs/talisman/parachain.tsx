import { chains } from '@domains/chains'
import { substrateApiState } from '@domains/common'
import crowdloanDataState, { type CrowdloanDetail } from '@libs/@talisman-crowdloans/provider'
import { find } from 'lodash'
import { type PropsWithChildren, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

export type { CrowdloanDetail } from '@libs/@talisman-crowdloans/provider'

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
  const crowdloans = useRecoilValue(crowdloanDataState)
  const crowdloanDetail = crowdloans.find(x => x.id === id)
  const slug = crowdloanDetail?.slug

  return {
    banner: `https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/promo/${slug ?? ''}-banner.png`,
    card: `https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/promo/${slug ?? ''}-card.png`,
    logo: `https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/${slug ?? ''}.svg`,
  }
}

//
// Hooks (internal)
//

export const useFindParachainDetails = (
  key: string,
  value: any
): Partial<{ parachainDetails?: CrowdloanDetail; hydrated: boolean }> => {
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
  parachains: CrowdloanDetail[]
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
  const [parachains, setParachains] = useState<CrowdloanDetail[]>([])

  const crowdloans = useRecoilValue(crowdloanDataState)

  const apisLoadable = useRecoilValueLoadable(
    waitForAll([substrateApiState(chains[0].rpc), substrateApiState(chains[1].rpc)])
  )

  useEffect(
    () => {
      if (hydrated) {
        return
      }

      if (apisLoadable.state !== 'hasValue') {
        return
      }

      void (async () => {
        const [polkadotApi, kusamaApi] = apisLoadable.contents

        const polkadotFunds = await polkadotApi.query.crowdloan.funds.entries()
        const kusamaFunds = await kusamaApi.query.crowdloan.funds.entries()

        const polkadotParaIds = polkadotFunds.map(x => `0-${x[0].args[0].toString()}`)
        const kusamaParaIds = kusamaFunds.map(x => `2-${x[0].args[0].toString()}`)

        const paraIds = [...polkadotParaIds, ...kusamaParaIds]

        setParachains(crowdloans.filter(x => paraIds.includes(x.id)))
        setHydrated(true)
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apisLoadable.state]
  )

  return <Context.Provider value={{ parachains, hydrated }}>{children}</Context.Provider>
}
