import { useChains, useEvmNetworks } from '@talismn/balances-react'
import { githubUnknownChainLogoUrl } from '@talismn/chaindata-provider'

import { cn } from '@/lib/utils'

type Props = {
  className?: string
  chainId?: string | number
}

const ChainLogo = ({ className, chainId }: Props) => {
  const chains = useChains()
  const networks = useEvmNetworks()
  const logoUrl = chainId ? chains[chainId]?.logo ?? networks[chainId]?.logo : undefined
  const roundLogo = !isTalismanLogo(logoUrl)

  return (
    <div className={cn('relative text-[24px] sm:text-[40px]', className)}>
      <img
        src={logoUrl ?? githubUnknownChainLogoUrl}
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

export default ChainLogo
