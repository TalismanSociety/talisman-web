import { SurfaceButton } from '@talismn/ui/atoms/Button'
import { ReactNode } from 'react'

import { AssetLogoWithChain, AssetLogoWithChainSkeleton } from '@/components/recipes/AssetLogoWithChain'
import { cn } from '@/lib/utils'

import type { TokenPickerAsset } from './api/utils/xcmTokenPickerTypes'

export type TokenSelectButtonProps = {
  title?: ReactNode
  empty?: boolean
  asset?: TokenPickerAsset
  onClick?: () => void
}

export function TokenSelectButton({ title = 'Select asset', empty, asset, onClick }: TokenSelectButtonProps) {
  const leadingIcon = empty ? (
    <AssetLogoWithChainSkeleton className="animate-none text-[2.4rem]" />
  ) : asset ? (
    <AssetLogoWithChain className="text-[2.4rem]" chainId={asset.chaindataId} assetLogoUrl={asset.chaindataTokenLogo} />
  ) : (
    <AssetLogoWithChainSkeleton className="text-[2.4rem]" />
  )
  const assetTextPlaceholder = (
    <div className={cn('my-[0.25em] h-[1em] w-24 animate-pulse rounded bg-gray-500', empty && 'animate-none')} />
  )
  const chainTextPlaceholder = (
    <div className={cn('my-[0.25em] h-[1em] w-36 animate-pulse rounded bg-gray-500', empty && 'animate-none')} />
  )

  return (
    <div className="[&>button>div>span]:!text-left [&>button>div]:!justify-start">
      <SurfaceButton
        leadingIcon={leadingIcon}
        onClick={onClick}
        css={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          width: '100%',
          padding: '0.6rem 1.25rem',
          borderRadius: '1.2rem',
        }}
      >
        <div className="flex h-14 items-center gap-1">
          {empty && <div className="text-lg">{title}</div>}
          {!empty && (
            <div>
              <div className="text-lg">{asset ? asset.token.originSymbol : assetTextPlaceholder}</div>
              <div className="text-foreground/70 text-lg">{asset ? asset.chain.name : chainTextPlaceholder}</div>
            </div>
          )}
        </div>
      </SurfaceButton>
    </div>
  )
}
