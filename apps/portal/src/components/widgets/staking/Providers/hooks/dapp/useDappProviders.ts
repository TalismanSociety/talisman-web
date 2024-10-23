import { Provider } from '../useProvidersData'
import { dappStakingEnabledChainsState } from '@/domains/chains'
import { useRecoilValue } from 'recoil'

const useDappProviders = (): Provider[] => {
  const chains = useRecoilValue(dappStakingEnabledChainsState)
  const dappProviders: Provider[] = chains.map(chain => {
    return {
      symbol: chain.nativeToken?.symbol,
      logo: chain.nativeToken?.logo,
      chainName: chain.name,
      chainId: chain.id,
      type: 'DApp staking',
      typeId: 'dappStaking',
      provider: chain.name,
      stakePercentage: 0,
      actionLink: `?action=stake&type=dapp-staking&chain=${chain?.id ?? ''}`,
      nativeToken: chain.nativeToken,
      rpc: '1234',
      genesisHash: chain.genesisHash,
    }
  })
  return dappProviders
}

export default useDappProviders
