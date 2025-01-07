import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { useMemo } from 'react'

import type { PortfolioToken } from '@/components/legacy/widgets/useAssets'
import { cn } from '@/util/cn'

import { ChainLogo } from './ChainLogo'

export const AssetNetworksLogoStack = ({
  className,
  token,
  max = 4,
}: {
  className?: string
  token: PortfolioToken
  max?: number
}) => {
  const [visibleTokens, moreTokens] = useMemo(() => {
    return [
      ([token, ...token.nonNativeTokens]?.slice(0, max) ?? []) as PortfolioToken[],
      ([token, ...token.nonNativeTokens]?.slice(max) ?? []) as PortfolioToken[],
    ] as const
  }, [token, max])

  return (
    <div className={cn('flex h-[1em]', className)}>
      {visibleTokens.map((token, index) => (
        <LogoItem key={index} token={token} />
      ))}
      <MoreLogoItems tokens={moreTokens} />
    </div>
  )
}

const LogoItem = ({ token }: { token: PortfolioToken }) => {
  const tooltip = useMemo(
    () => `${token.tokenDetails.networkInfo?.label} (${token.tokenDetails.networkInfo?.type})`,
    [token]
  )

  return (
    <div className="ml-[-0.25rem] h-[1em] w-[1em] overflow-hidden">
      <Tooltip content={tooltip}>
        <ChainLogo
          className="relative text-[1em] sm:text-[1em]"
          chainId={token.tokenDetails.chain?.id ?? token.tokenDetails.evmNetwork?.id}
        />
      </Tooltip>
    </div>
  )
}

const MoreLogoItems = ({ tokens }: { tokens: PortfolioToken[] }) => {
  if (!tokens.length) return null
  return (
    <div className="ml-[-0.25rem] h-[1em] overflow-hidden">
      <Tooltip content={<MoreLogoItemsTooltip tokens={tokens} />}>
        <div className="relative flex h-[1em] items-center justify-center overflow-hidden rounded-xl bg-gray-500 px-1 text-black">
          <div className="text-[0.5em]">+{tokens.length}</div>
        </div>
      </Tooltip>
    </div>
  )
}

const MoreLogoItemsTooltip = ({ tokens }: { tokens: PortfolioToken[] }) => (
  <div className="flex flex-col gap-1 text-left">
    {tokens.map((token, index) => (
      <div key={index}>
        {token.tokenDetails.networkInfo.label} ({token.tokenDetails.networkInfo.type})
      </div>
    ))}
  </div>
)
