import { useNetworksById } from '@talismn/balances-react'

import { cn } from '@/util/cn'
import { UNKNOWN_TOKEN_URL } from '@/util/unknownLogoUrls'

type Props = {
  className?: string
  networkId?: string | number
  assetLogoUrl: string | undefined
}

export const AssetLogoWithChain = ({ className, assetLogoUrl, networkId }: Props) => {
  const networks = useNetworksById()
  const networkLogo = networkId ? networks[networkId]?.logo : undefined
  const roundAssetLogo = !isTalismanLogo(assetLogoUrl)

  return (
    <div className={cn('relative text-[24px] sm:text-[40px]', className)}>
      {networkLogo ? (
        <img
          src={networkLogo}
          className={cn(
            'absolute right-0 top-0 h-[0.5rem] min-h-[0.5em] w-[0.5em] min-w-[0.5em] -translate-y-1/4 translate-x-1/4',
            'rounded-full border-[0.05em] border-gray-800 bg-gray-800',
            className
          )}
        />
      ) : null}
      <img
        src={assetLogoUrl ?? UNKNOWN_TOKEN_URL}
        className={cn('h-[1em] min-h-[1em] w-[1em] min-w-[1em]', roundAssetLogo && 'rounded-full', className)}
      />
    </div>
  )
}

export const AssetLogoWithChainSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('relative animate-pulse text-[24px] sm:text-[40px]', className)}>
    <div
      className={cn(
        'absolute right-0 top-0 h-[0.5rem] min-h-[0.5em] w-[0.5em] min-w-[0.5em] -translate-y-1/4 translate-x-1/4',
        'rounded-full border-[0.05em] border-gray-800 bg-gray-500',
        className
      )}
    />
    <div className={cn('h-[1em] min-h-[1em] w-[1em] min-w-[1em] rounded-full bg-gray-500', className)} />
  </div>
)

/** We should only round logos which aren't hosted on our chaindata repo */
function isTalismanLogo(url?: string | null) {
  if (!url) return false
  return (
    /^https:\/\/raw\.githubusercontent\.com\/TalismanSociety\/chaindata\//i.test(url) &&
    !/assets\/tokens\/coingecko/i.test(url)
  )
}
