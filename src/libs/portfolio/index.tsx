import { CrowdloanContribution } from '@libs/crowdloans'
import type { BalanceWithTokensWithPrice } from '@talismn/api-react-hooks'
import { groupBalancesByAddress } from '@talismn/api-react-hooks'
import { addBigNumbers, encodeAnyAddress, multiplyBigNumbers, planckToTokens } from '@talismn/util'
import useUniqueId from '@util/useUniqueId'
import { FC, useContext as _useContext, createContext, useCallback, useEffect, useMemo, useState } from 'react'

// TODO: Replace this lib with an @talismn/api wrapper or redesign.
//       Currently we get balances from the api, then convert and aggregate them all
//       downstream. This means we have to keep track of all the converted and aggregated
//       values in order to provide useful summaries to the user (e.g. totalUsd, totalUsdByAddress, etc).
//
//       Soon we should just provide methods for these summaries directly via @talismn/api,
//       which will take care of fetching and updating the underlying balances as appropriate for us.

// Helpers (exported)
export function calculateAssetPortfolioAmounts(
  balances: Array<BalanceWithTokensWithPrice | null>
): Array<{ tags: Tag[]; amount: string | undefined }> {
  const amounts: Array<{ tags: Tag[]; amount: string | undefined }> = []

  const byAddress = groupBalancesByAddress(balances)

  Object.entries(byAddress).forEach(([address, balances]) => {
    const tags: Tag[] = ['USD', 'Assets', { Address: address }]
    balances.forEach(balance => amounts.push({ tags, amount: balance.usd }))
  })

  return amounts
}

export function calculateCrowdloanPortfolioAmounts(
  contributions: CrowdloanContribution[],
  tokenDecimals?: number,
  tokenPrice?: string
): Array<{ tags: Tag[]; amount: string | undefined }> {
  const amounts: Array<{ tags: Tag[]; amount: string | undefined }> = []

  const byAddress: { [key: string]: CrowdloanContribution[] } = {}
  contributions.forEach(contribution => {
    if (!byAddress[encodeAnyAddress(contribution.account, 42)])
      byAddress[encodeAnyAddress(contribution.account, 42)] = []
    byAddress[encodeAnyAddress(contribution.account, 42)].push(contribution)
  })

  Object.entries(byAddress).forEach(([address, contributions]) => {
    const tags: Tag[] = ['USD', 'Crowdloans', { Address: address }]
    contributions.forEach(contribution => {
      const contributionTokens = planckToTokens(contribution.amount, tokenDecimals)
      const contributionUsd = multiplyBigNumbers(contributionTokens, tokenPrice)
      amounts.push({ tags, amount: contributionUsd })
    })
  })

  return amounts
}

//
// Types
//

export type Portfolio = {
  totalUsd: string
  totalUsdByAddress: { [key: string]: string }
  totalAssetsUsd: string
  totalAssetsUsdByAddress: { [key: string]: string }
  totalCrowdloansUsd: string
  totalCrowdloansUsdByAddress: { [key: string]: string }
  totalStakingUsd: string
  totalStakingUsdByAddress: { [key: string]: string }

  isLoading: boolean
  // only true if we've finished loading all amounts and they're all zero
  hasEmptyBags: boolean
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

export function usePortfolioHasEmptyBags(): boolean {
  return useContext().portfolio.hasEmptyBags
}

export function useTaggedAmountsInPortfolio(amounts: Array<{ tags: Tag[]; amount: string | undefined }>): void {
  const { storeTotal, clearTotal, setLoading } = useContext()
  const uniqueId = useUniqueId()

  useEffect(() => {
    if (amounts.length === 0) setLoading(uniqueId, true)

    amounts.forEach(({ tags, amount }, index) => {
      if (!amount) return
      storeTotal(`${uniqueId}--${index}`, tags, amount || '0')
    })

    if (amounts.length !== 0) setLoading(uniqueId, false)

    return () => {
      amounts.forEach((_, index) => clearTotal(`${uniqueId}--${index}`))
      setLoading(uniqueId, false)
    }
  }, [uniqueId, amounts, storeTotal, clearTotal, setLoading])
}

export function useTaggedAmountInPortfolio(tags: Tag[], amount: string | undefined): void {
  const amounts = useMemo(() => [{ tags, amount }], [tags, amount])
  return useTaggedAmountsInPortfolio(amounts)
}

//
// Context
//

type ContextProps = {
  portfolio: Portfolio
  storeTotal: (uniqueId: string, tags: Tag[], amount: string) => void
  clearTotal: (uniqueId: string) => void
  setLoading: (uniqueId: string, loading: boolean) => void
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

export const Provider: FC<ProviderProps> = ({ children }) => {
  const [totalStore, setTotalStore] = useState<TotalStore>({})
  const [loadingList, setLoadingList] = useState<{ [key: string]: true }>({})

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
  const setLoading = useCallback(
    (uniqueId, loading) =>
      setLoadingList(loadingList => {
        if (loading && loadingList[uniqueId]) return loadingList
        if (!loading && !loadingList[uniqueId]) return loadingList

        const loadingListMut = { ...loadingList }
        if (loading) loadingListMut[uniqueId] = true
        else delete loadingListMut[uniqueId]

        return loadingListMut
      }),
    []
  )

  const portfolio = useMemo<Portfolio>(() => {
    let totalUsd = '0'
    let totalUsdByAddress: { [key: string]: string } = {}
    let totalAssetsUsd = '0'
    let totalAssetsUsdByAddress: { [key: string]: string } = {}
    let totalCrowdloansUsd = '0'
    let totalCrowdloansUsdByAddress: { [key: string]: string } = {}
    let totalStakingUsd = '0'
    let totalStakingUsdByAddress: { [key: string]: string } = {}

    Object.values(totalStore).forEach(({ tags, amount }) => {
      if (tags.includes('USD')) {
        totalUsd = addBigNumbers(totalUsd, amount)

        tags
          .filter((tag): tag is AddressTag => Object.keys(tag).length === 1 && Object.keys(tag)[0] === 'Address')
          .map(tag => tag.Address)
          .forEach(address => {
            if (!totalUsdByAddress[address]) totalUsdByAddress[address] = '0'
            totalUsdByAddress[address] = addBigNumbers(totalUsdByAddress[address], amount)

            if (tags.includes('Assets')) {
              if (!totalAssetsUsdByAddress[address]) totalAssetsUsdByAddress[address] = '0'
              totalAssetsUsdByAddress[address] = addBigNumbers(totalAssetsUsdByAddress[address], amount)
            }
            if (tags.includes('Crowdloans')) {
              if (!totalCrowdloansUsdByAddress[address]) totalCrowdloansUsdByAddress[address] = '0'
              totalCrowdloansUsdByAddress[address] = addBigNumbers(totalCrowdloansUsdByAddress[address], amount)
            }
            if (tags.includes('Staking')) {
              if (!totalStakingUsdByAddress[address]) totalStakingUsdByAddress[address] = '0'
              totalStakingUsdByAddress[address] = addBigNumbers(totalStakingUsdByAddress[address], amount)
            }
          })

        if (tags.includes('Assets')) totalAssetsUsd = addBigNumbers(totalAssetsUsd, amount)
        if (tags.includes('Crowdloans')) totalCrowdloansUsd = addBigNumbers(totalCrowdloansUsd, amount)
        if (tags.includes('Staking')) totalStakingUsd = addBigNumbers(totalStakingUsd, amount)
      }
    })

    const isLoading = Object.keys(loadingList).length !== 0
    const hasEmptyBags = !isLoading && totalUsd === '0'

    return {
      totalUsd,
      totalUsdByAddress,
      totalAssetsUsd,
      totalAssetsUsdByAddress,
      totalCrowdloansUsd,
      totalCrowdloansUsdByAddress,
      totalStakingUsd,
      totalStakingUsdByAddress,
      isLoading,
      hasEmptyBags,
    }
  }, [totalStore, loadingList])

  const value = useMemo(
    () => ({ portfolio, storeTotal, clearTotal, setLoading }),
    [portfolio, storeTotal, clearTotal, setLoading]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
