import { CircularProgressIndicator, SurfaceButton, Text } from '@talismn/ui'

import AssetLogoWithChain from '@/components/recipes/AssetLogoWithChain'

import type { TokenPickerAsset } from './api/utils/xcmTokenPickerTypes'

export type TokenSelectButtonProps = {
  asset?: TokenPickerAsset
  onClick?: () => void
}

export function TokenSelectButton({ asset, onClick }: TokenSelectButtonProps) {
  const leadingIcon = asset ? (
    <AssetLogoWithChain className="text-[2.4rem]" chainId={asset.chaindataId} assetLogoUrl={asset.chaindataTokenLogo} />
  ) : (
    <CircularProgressIndicator size="2rem" css={{ margin: '0.2rem' }} />
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
        <Text.BodySmall as="div" alpha="high">
          {asset ? asset.token.originSymbol : <>…</>}
        </Text.BodySmall>
        <Text.BodySmall as="div">{asset ? asset.chain.name : <>…</>}</Text.BodySmall>
      </SurfaceButton>
    </div>
  )
}
