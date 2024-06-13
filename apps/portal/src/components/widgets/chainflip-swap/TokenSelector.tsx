import { chainflipAssetsAndChainsState } from './api'
import { assetIcons, chainIcons } from './chainflip-config'
import TokenSelectDialog from '@/components/recipes/TokenSelectDialog'
import { useBalances } from '@talismn/balances-react'
import { Skeleton, SurfaceButton } from '@talismn/ui'
import type React from 'react'
import { useMemo, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'

type Props = {
  selectedAssetId: string
}

export const TokenSelector: React.FC<Props> = ({ selectedAssetId }) => {
  const assetsAndChains = useRecoilValueLoadable(chainflipAssetsAndChainsState)
  const [open, setOpen] = useState(false)
  const {} = useBalances()

  const chainItems = useMemo(
    () =>
      assetsAndChains.state === 'hasValue'
        ? assetsAndChains.contents.chains.map(chain => ({
            id: chain.chain,
            name: chain.name,
            iconSrc: chainIcons[chain.chain],
          }))
        : undefined,
    [assetsAndChains]
  )

  const assetItems = useMemo(
    () =>
      assetsAndChains.state === 'hasValue'
        ? assetsAndChains.contents.assets.map(asset => ({
            id: asset.asset,
            name: asset.name,
            code: asset.symbol,
            iconSrc: assetIcons[asset.asset],
            chain: asset.chain?.chain ?? '',
            chainId: asset.chain?.chain ?? '',
            amount: 0,
            fiatAmount: 0,
          }))
        : [],
    [assetsAndChains.state, assetsAndChains.contents.assets]
  )

  const selectedAsset = useMemo(() => {
    if (assetsAndChains.state === 'hasValue') {
      return assetsAndChains.contents.assets.find(asset => asset.chainflipId === selectedAssetId)
    }
    return null
  }, [selectedAssetId, assetsAndChains])
  if (assetsAndChains.state === 'loading') return <Skeleton.Surface className="w-[80px] h-[40px]" />

  return (
    <div className="">
      <SurfaceButton
        className="!py-[4px] !h-[40px] !rounded-[8px] items-center"
        leadingIcon={selectedAsset ? assetIcons[selectedAsset.asset] : undefined}
        onClick={() => setOpen(true)}
      >
        {selectedAsset ? selectedAsset.name : 'Select Token'}
      </SurfaceButton>
      {open && (
        <TokenSelectDialog
          chains={chainItems ?? []}
          tokens={assetItems ?? []}
          onRequestDismiss={() => setOpen(false)}
          onSelectToken={token => {
            console.log(token)
          }}
        />
      )}
    </div>
  )
}
