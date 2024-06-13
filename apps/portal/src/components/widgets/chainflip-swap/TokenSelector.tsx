import { chainflipAssetsAndChainsState } from './api'
import { assetIcons, chainIcons } from './chainflip-config'
import TokenSelectDialog, { type Token } from '@/components/recipes/TokenSelectDialog'
import { type Chain } from '@chainflip/sdk/swap'
import { Skeleton, SurfaceButton } from '@talismn/ui'
import type React from 'react'
import { useMemo, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'

type Props = {
  selectedAssetSymbol: string | null
  selectedAssetChain: string | null
  assetFilter?: (asset: Token) => boolean
  onSelectToken: (asset: Token) => void
}

export const TokenSelector: React.FC<Props> = ({
  selectedAssetSymbol,
  selectedAssetChain,
  assetFilter,
  onSelectToken,
}) => {
  const assetsAndChains = useRecoilValueLoadable(chainflipAssetsAndChainsState)
  const [open, setOpen] = useState(false)

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
            .map(asset => ({
              id: asset.asset,
              name: asset.name,
              code: asset.symbol,
              iconSrc: assetIcons[asset.asset],
              chain: asset.chain?.name,
              chainId: asset.chain?.chain,
              amount: 0,
              fiatAmount: 0,
            }))
            .filter(asset => assetFilter?.(asset) ?? true)
        : [],
    [assetsAndChains.state, assetsAndChains.contents.assets, assetFilter]
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
        className="!py-[4px] !px-[8px] !h-[40px] !rounded-[8px] items-center"
        leadingIcon={
          selectedToken ? <img src={assetIcons[selectedToken.asset] ?? ''} className="w-[24px] h-[24px]" /> : undefined
        }
        onClick={() => setOpen(true)}
      >
        {selectedToken ? (
          <div className="text-left">
            <p className="text-[14px] leading-none mb-[2px]">{selectedToken.symbol}</p>
            <p className="text-[10px] text-gray-400 leading-none">{selectedToken.chain?.name}</p>
          </div>
        ) : (
          <p className="text-gray-400 text-[14px]">Select Token</p>
        )}
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
