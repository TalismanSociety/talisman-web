import useUniqueId from '@util/useUniqueId'
import { FC, useContext as _useContext, createContext, useCallback, useEffect, useMemo, useState } from 'react'

//
// Types
//

export type Portfolio = {
  totalUsd: string
  totalUsdByAddress: { [key: string]: string }
  totalAssetsUsd: string
  totalCrowdloansUsd: string
  totalStakingUsd: string
}

export type AddressTag = { Address: string }
export type Tag = 'USD' | 'Assets' | 'Crowdloans' | 'Staking' | AddressTag

export type Total = {
  tags: Tag[]
  amount: string
}

export type TotalStore = {
  [key: string]: Total
}

//
// Hooks (exported)
//

export function usePortfolio(): Portfolio {
  const { portfolio } = useContext()
  return portfolio
}

export function useTaggedAmountInPortfolio(tags: Tag[], amount: string | undefined): void {
  const { storeTotal, clearTotal } = useContext()
  const uniqueId = useUniqueId()

  useEffect(() => {
    if (!amount) return

    storeTotal(uniqueId, tags, amount)
    return () => clearTotal(uniqueId)
  }, [uniqueId, tags, amount, storeTotal, clearTotal])
}

//
// Context
//

type ContextProps = {
  portfolio: Portfolio
  storeTotal: (uniqueId: string, tags: Tag[], amount: string) => void
  clearTotal: (uniqueId: string) => void
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The portfolio provider is required in order to use this hook')

  return context
}

//
// Provider
//

type ProviderProps = {}

const Provider: FC<ProviderProps> = ({ children }) => {
  const [totalStore, setTotalStore] = useState<TotalStore>({})

  const storeTotal = useCallback(
    (uniqueId, tags, amount) => setTotalStore(totalStore => ({ ...totalStore, [uniqueId]: { tags, amount } })),
    []
  )
  const clearTotal = useCallback(
    uniqueId =>
      setTotalStore(totalStore => {
        delete totalStore[uniqueId]
        return totalStore
      }),
    []
  )

  const portfolio = useMemo<Portfolio>(() => {
    let totalUsd = '0'
    let totalUsdByAddress: { [key: string]: string } = {}
    let totalAssetsUsd = '0'
    let totalCrowdloansUsd = '0'
    let totalStakingUsd = '0'

    Object.values(totalStore).forEach(({ tags, amount }) => {
      if (tags.includes('USD')) {
        totalUsd = String(Number(totalUsd) + Number(amount)) // TODO: BN.js arithmetic?

        tags
          .filter((tag): tag is AddressTag => Object.keys(tag).length === 1 && Object.keys(tag)[0] === 'Address')
          .map(tag => tag.Address)
          .forEach(address => {
            if (!totalUsdByAddress[address]) totalUsdByAddress[address] = '0'
            totalUsdByAddress[address] = String(Number(totalUsdByAddress[address]) + Number(amount))
          })

        if (tags.includes('Assets')) totalAssetsUsd = String(Number(totalAssetsUsd) + Number(amount))
        if (tags.includes('Crowdloans')) totalCrowdloansUsd = String(Number(totalCrowdloansUsd) + Number(amount))
        if (tags.includes('Staking')) totalStakingUsd = String(Number(totalStakingUsd) + Number(amount))
      }
    })

    return { totalUsd, totalUsdByAddress, totalAssetsUsd, totalCrowdloansUsd, totalStakingUsd }
  }, [totalStore])

  const value = useMemo(() => ({ portfolio, storeTotal, clearTotal }), [portfolio, storeTotal, clearTotal])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default Provider
