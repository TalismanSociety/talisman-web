import type { CommonSwappableAssetType } from './swap-modules/common.swap-module'
import { swappableTokensAtom } from './swaps.api'
import TokenSelectDialog, { type Token } from '@/components/recipes/TokenSelectDialog'
import { selectedCurrencyState } from '@/domains/balances'
import { useGetEvmOrSubstrateChain } from '@/hooks/useGetEvmOrSubstrateChain'
import { ErrorBoundary } from '@sentry/react'
import { useBalances, useTokens } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { Skeleton, SurfaceButton } from '@talismn/ui'
import { X } from '@talismn/web-icons'
import { useAtomValue } from 'jotai'
import type React from 'react'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

type Props = {
  selectedAsset: CommonSwappableAssetType | null
  assetFilter?: (asset: CommonSwappableAssetType) => boolean
  onSelectAsset: (asset: CommonSwappableAssetType | null) => void
  balanceFor?: string | null
}

export const SwapTokenSelector: React.FC<Props> = ({ selectedAsset, assetFilter, onSelectAsset, balanceFor }) => {
  const allSwappableAssets = useAtomValue(swappableTokensAtom)
  const [open, setOpen] = useState(false)
  const balances = useBalances()
  const tokens = useTokens()
  const getChain = useGetEvmOrSubstrateChain()
  const currency = useRecoilValue(selectedCurrencyState)

  const token = useMemo((): (typeof tokens)[string] | null => {
    if (!selectedAsset) return null
    return tokens[selectedAsset.id] ?? null
  }, [selectedAsset, tokens])

  const chain = useMemo(() => (selectedAsset ? getChain(selectedAsset.chainId) : null), [selectedAsset, getChain])

  const filteredAssets = useMemo(
    () => (assetFilter ? allSwappableAssets.filter(assetFilter) : allSwappableAssets),
    [allSwappableAssets, assetFilter]
  )

  const assetItems = useMemo(
    () =>
      filteredAssets
        .map((asset): Token | null => {
          const token = tokens[asset.id]
          const chain = getChain(asset.chainId)
          if (!chain) return null
          const assetBalances = balances.find(balance => balance.tokenId === asset.id)
          const balanceToDisplay = balanceFor
            ? assetBalances?.find(b => b.address.toLowerCase() === balanceFor.toLowerCase())
            : assetBalances

          return {
            id: asset.id,
            name: asset.name,
            code: asset.symbol,
            iconSrc: token?.logo ?? githubUnknownTokenLogoUrl,
            chain: chain.name ?? '',
            chainId: asset.chainId,
            amount: Decimal.fromPlanck(balanceToDisplay.sum.planck.transferable, asset.decimals, {
              currency: asset.symbol,
            }).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
            fiatAmount: balanceToDisplay.sum.fiat(currency).transferable.toLocaleString(undefined, {
              style: 'currency',
              currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          }
        })
        .filter(asset => asset !== null) as Token[],
    [filteredAssets, tokens, getChain, balances, balanceFor, currency]
  )

  const chainItems = useMemo(() => {
    const chains: Record<number | string, string> = {}
    assetItems.forEach(a => {
      if (a !== null) chains[a.chainId] = a.chain
    })

    return Object.entries(chains).map(([id, name]) => ({
      id,
      name,
      iconSrc: getChain(id)?.logo ?? '',
    }))
  }, [assetItems, getChain])

  const handleSelectToken = useCallback(
    (token: Token) => {
      setOpen(false)
      onSelectAsset(filteredAssets.find(a => token.id === a.id) ?? null)
    },
    [filteredAssets, onSelectAsset]
  )

  if (Object.keys(tokens).length === 0) return <Skeleton.Surface className="w-[80px] h-[40px]" />

  return (
    <div className="">
      <SurfaceButton
        className="!py-[4px] !px-[8px] !h-[40px] !rounded-[8px] items-center flex"
        // TODO: need a logo for unknown token logo
        leadingIcon={
          selectedAsset ? (
            <img src={token?.logo ?? ''} className="w-[24px] h-[24px] min-w-[24px] rounded-full" />
          ) : undefined
        }
        onClick={() => setOpen(true)}
      >
        <div>
          {selectedAsset ? (
            <div className="flex items-center gap-[4px]">
              <div className="text-left">
                <p className="text-[14px] leading-none mb-[2px]">{selectedAsset.symbol}</p>
                <p className="text-[10px] text-gray-400 leading-none whitespace-nowrap max-w-[52px] overflow-hidden text-ellipsis">
                  {chain?.name}
                </p>
              </div>
              <X
                size={16}
                onClick={e => {
                  e.stopPropagation()
                  onSelectAsset(null)
                }}
              />
            </div>
          ) : (
            <p className="text-gray-400 text-[12px] sm:text-[14px] whitespace-nowrap">Select Token</p>
          )}
        </div>
      </SurfaceButton>
      {open && (
        <TokenSelectDialog
          chains={chainItems ?? []}
          tokens={assetItems ?? []}
          onRequestDismiss={() => setOpen(false)}
          onSelectToken={handleSelectToken}
        />
      )}
    </div>
  )
}

export const SuspensedSwapTokenSelector: React.FC<Props> = props => (
  <ErrorBoundary fallback={<Skeleton.Surface className="w-[80px] h-[40px]" />}>
    <Suspense fallback={<Skeleton.Surface className="w-[80px] h-[40px]" />}>
      <SwapTokenSelector {...props} />
    </Suspense>
  </ErrorBoundary>
)
