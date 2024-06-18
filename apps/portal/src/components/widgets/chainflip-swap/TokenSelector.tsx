import { assetIcons, chainIcons } from './chainflip-config'
import { chainflipAssetsAndChainsState } from './chainflip.api'
import { getBalanceForChainflipAsset } from './swap.api'
import TokenSelectDialog, { type Token } from '@/components/recipes/TokenSelectDialog'
import { selectedCurrencyState } from '@/domains/balances'
import { type Chain } from '@chainflip/sdk/swap'
import { useBalances } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { Skeleton, SurfaceButton } from '@talismn/ui'
import { X } from '@talismn/web-icons'
import type React from 'react'
import { useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

type Props = {
  selectedAssetSymbol: string | null
  selectedAssetChain: string | null
  assetFilter?: (asset: Token) => boolean
  onSelectToken: (asset: Token | null) => void
  balanceFor?: string | null
}

export const TokenSelector: React.FC<Props> = ({
  selectedAssetSymbol,
  selectedAssetChain,
  assetFilter,
  onSelectToken,
  balanceFor,
}) => {
  const assetsAndChains = useRecoilValueLoadable(chainflipAssetsAndChainsState)
  const [open, setOpen] = useState(false)
  const balances = useBalances()
  const currency = useRecoilValue(selectedCurrencyState)

  const selectedToken = useMemo(() => {
    if (assetsAndChains.state !== 'hasValue') return undefined
    return (
      assetsAndChains.contents.assets.find(
        asset => asset.symbol === selectedAssetSymbol && asset.chain?.chain === selectedAssetChain
      ) ?? null
    )
  }, [assetsAndChains, selectedAssetSymbol, selectedAssetChain])

  const assetItems = useMemo(
    () =>
      assetsAndChains.state === 'hasValue'
        ? assetsAndChains.contents.assets
            .map(asset => {
              const assetBalances = getBalanceForChainflipAsset(balances, asset.symbol, asset.chain)
              const balanceToDisplay = balanceFor
                ? assetBalances?.find(b => b.address.toLowerCase() === balanceFor.toLowerCase())
                : assetBalances

              return {
                id: asset.asset,
                name: asset.name,
                code: asset.symbol,
                iconSrc: assetIcons[asset.asset],
                chain: asset.chain?.name,
                chainId: asset.chain?.chain,
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
            .filter(asset => assetFilter?.(asset) ?? true)
        : [],
    [assetsAndChains.state, assetsAndChains.contents.assets, assetFilter, currency, balances, balanceFor]
  )

  const chainItems = useMemo(() => {
    const chains: Partial<Record<Chain, string>> = {}
    assetItems.forEach(a => {
      chains[a.chainId] = a.chain
    })

    return Object.entries(chains).map(([id, name]) => ({
      id,
      name,
      iconSrc: chainIcons[id as Chain],
    }))
  }, [assetItems])

  if (assetsAndChains.state === 'loading') return <Skeleton.Surface className="w-[80px] h-[40px]" />

  return (
    <div className="">
      <SurfaceButton
        className="!py-[4px] !px-[8px] !h-[40px] !rounded-[8px] items-center flex"
        leadingIcon={
          selectedToken ? <img src={assetIcons[selectedToken.asset] ?? ''} className="w-[24px] h-[24px]" /> : undefined
        }
        onClick={() => setOpen(true)}
      >
        <div>
          {selectedToken ? (
            <div className="flex items-center gap-[4px]">
              <div className="text-left">
                <p className="text-[14px] leading-none mb-[2px]">{selectedToken.symbol}</p>
                <p className="text-[10px] text-gray-400 leading-none">{selectedToken.chain?.name}</p>
              </div>
              <X
                size={16}
                onClick={e => {
                  e.stopPropagation()
                  onSelectToken(null)
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
          onSelectToken={onSelectToken}
        />
      )}
    </div>
  )
}
