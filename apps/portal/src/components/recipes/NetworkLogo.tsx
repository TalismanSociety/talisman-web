import { useNetworksById } from '@talismn/balances-react'

import { cn } from '@/util/cn'
import { UNKNOWN_TOKEN_URL } from '@/util/unknownLogoUrls'

type Props = {
  className?: string
  networkId?: string | number
}

export const NetworkLogo = ({ className, networkId }: Props) => {
  const networks = useNetworksById()
  const logoUrl = networkId ? networks[networkId]?.logo : undefined
  const roundLogo = !isTalismanLogo(logoUrl)

  return (
    <div className={cn('relative text-[24px] sm:text-[40px]', className)}>
      <img
        src={logoUrl ?? UNKNOWN_TOKEN_URL}
        className={cn('h-[1em] min-h-[1em] w-[1em] min-w-[1em]', roundLogo && 'rounded-full', className)}
      />
    </div>
  )
}

/** We should only round logos which aren't hosted on our chaindata repo */
function isTalismanLogo(url?: string | null) {
  if (!url) return false
  return (
    /^https:\/\/raw\.githubusercontent\.com\/TalismanSociety\/chaindata\//i.test(url) &&
    !/assets\/tokens\/coingecko/i.test(url)
  )
}
