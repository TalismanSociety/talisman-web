import { useChains, useEvmNetworks } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'

type Props = {
  chainId: string | number
  assetLogoUrl: string | undefined
}

const AssetLogoWithChain = ({ assetLogoUrl, chainId }: Props) => {
  const chains = useChains()
  const networks = useEvmNetworks()
  const networkLogo = chains[chainId]?.logo ?? networks[chainId]?.logo

  return (
    <div className="relative">
      {networkLogo ? (
        <img
          src={networkLogo}
          className="border-[2px] bg-gray-800 border-gray-800 w-[12px] absolute -top-[4px] -right-[4px] h-[12px] min-w-[12px] sm:min-w-[20px] sm:w-[20px] sm:h-[20px] rounded-full"
        />
      ) : null}
      <img
        src={assetLogoUrl ?? githubUnknownTokenLogoUrl}
        className="w-[24px] h-[24px] min-w-[24px] sm:min-w-[40px] sm:w-[40px] sm:h-[40px] rounded-full"
      />
    </div>
  )
}

export default AssetLogoWithChain
