import { chainIcons } from './chainflip-config'
import { allSwappableChainsState, allSwappableAssetsState, type AssetsWithProtocols } from './swap.api'
import { SwappableChainId, type SwappableAssetType, type SwappableChainType } from './swap.types'
import TokenSelectDialog, { type Token } from '@/components/recipes/TokenSelectDialog'
import { selectedCurrencyState } from '@/domains/balances'
import { type Chain } from '@chainflip/sdk/swap'
import { useBalances, useTokens } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { Skeleton, SurfaceButton } from '@talismn/ui'
import { X } from '@talismn/web-icons'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

type Props = {
  selectedAsset: AssetsWithProtocols | null
  assetFilter?: (asset: AssetsWithProtocols) => boolean
  onSelectAsset: (asset: AssetsWithProtocols | null) => void
  balanceFor?: string | null
}

const getTokenId = (asset: Pick<SwappableAssetType, 'contractAddress'>, chain: SwappableChainType) =>
  `${chain.chainId}-${chain.type}-${asset.contractAddress ? `erc20-${asset.contractAddress.toLowerCase()}` : 'native'}`

export const TokenSelectorNew: React.FC<Props> = ({ selectedAsset, assetFilter, onSelectAsset, balanceFor }) => {
  const chainsById = useRecoilValueLoadable(allSwappableChainsState)
  const allSwappableAssets = useRecoilValueLoadable(allSwappableAssetsState)
  const [open, setOpen] = useState(false)
  const balances = useBalances()
  const tokens = useTokens()
  const currency = useRecoilValue(selectedCurrencyState)

  const chain = useMemo(() => {
    if (chainsById.state !== 'hasValue' || !selectedAsset) return undefined
    return chainsById.contents[selectedAsset.chainId]
  }, [chainsById.contents, chainsById.state, selectedAsset])

  const token = useMemo((): (typeof tokens)[string] | null => {
    if (!selectedAsset || !chain) return null
    return tokens[getTokenId(selectedAsset, chain)] ?? null
  }, [chain, selectedAsset, tokens])

  const filteredAssets = useMemo(
    () =>
      allSwappableAssets.state === 'hasValue'
        ? assetFilter
          ? allSwappableAssets.contents.filter(assetFilter)
          : allSwappableAssets.contents
        : [],
    [allSwappableAssets, assetFilter]
  )

  const assetItems = useMemo(
    () =>
      filteredAssets
        .map(asset => {
          const chain = chainsById.contents[asset.chainId]
          if (!chain) return null
          const tokenId = getTokenId(asset, chain)
          const token = tokens[tokenId]
          if (!token) return null

          const assetBalances = balances.find(balance => balance.tokenId === tokenId)
          const balanceToDisplay = balanceFor
            ? assetBalances?.find(b => b.address.toLowerCase() === balanceFor.toLowerCase())
            : assetBalances

          return {
            id: tokenId,
            name: asset.name,
            code: asset.symbol,
            iconSrc: token.logo,
            chain: chain.name,
            chainId: chain.chainId,
            amount: Decimal.fromPlanck(balanceToDisplay.sum.planck.transferable, 18, {
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
    [filteredAssets, chainsById.contents, tokens, balances, balanceFor, currency]
  )

  const chainItems = useMemo(() => {
    const chains: Partial<Record<SwappableChainId, string>> = {}
    assetItems.forEach(a => {
      if (a !== null) chains[a.chainId as SwappableChainId] = a.chain
    })

    return Object.entries(chains).map(([id, name]) => ({
      id,
      name,
      iconSrc: chainIcons[id as Chain],
    }))
  }, [assetItems])

  const handleSelectToken = useCallback(
    (token: Token) => {
      if (chainsById.state !== 'hasValue') return
      setOpen(false)
      const chain = chainsById.contents[token.chainId as SwappableChainId]
      if (!chain) return

      const asset = filteredAssets.find(a => token.id === getTokenId(a, chain))
      onSelectAsset(asset ?? null)
    },
    [chainsById.contents, chainsById.state, filteredAssets, onSelectAsset]
  )

  if (allSwappableAssets.state === 'loading' || chainsById.state === 'loading')
    return <Skeleton.Surface className="w-[80px] h-[40px]" />

  return (
    <div className="">
      <SurfaceButton
        className="!py-[4px] !px-[8px] !h-[40px] !rounded-[8px] items-center flex"
        // TODO: need a logo for unknown token logo
        leadingIcon={selectedAsset ? <img src={token?.logo ?? ''} className="w-[24px] h-[24px]" /> : undefined}
        onClick={() => setOpen(true)}
      >
        <div>
          {selectedAsset && chain ? (
            <div className="flex items-center gap-[4px]">
              <div className="text-left">
                <p className="text-[14px] leading-none mb-[2px]">{selectedAsset.symbol}</p>
                <p className="text-[10px] text-gray-400 leading-none">{chain.name}</p>
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
            <p className="text-gray-400 text-[14px]">Select Token</p>
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
