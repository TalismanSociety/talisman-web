import { Text } from '@talismn/ui/atoms/Text'

import { AssetLogoWithChain } from '@/components/recipes/AssetLogoWithChain'

type AssetProps = {
  chainId: string | number
  logo: string | undefined
  symbol: string
  chainName: string
}

const Asset = ({ chainId, logo, symbol, chainName }: AssetProps) => {
  return (
    <div
      css={{
        gridArea: 'asset',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
      }}
    >
      <AssetLogoWithChain chainId={chainId} assetLogoUrl={logo} />
      <div className="truncate">
        <Text.Body as="div" alpha="high">
          {symbol}
        </Text.Body>
        <Text.BodySmall as="div">{chainName}</Text.BodySmall>
      </div>
    </div>
  )
}

export default Asset
