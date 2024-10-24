import { Provider } from '../useProvidersData'
import { subtensorStakingEnabledChainsState } from '@/domains/chains'
import { useRecoilValue } from 'recoil'

const useSubtensorProviders = () => {
  const chains = useRecoilValue(subtensorStakingEnabledChainsState)

  const subtensorProviders: Provider[] = chains.map(chain => {
    return {
      symbol: chain.nativeToken?.symbol ?? '',
      logo: chain.nativeToken?.logo ?? '',
      chainName: chain.name ?? '',
      chainId: chain.id,
      type: 'Delegation',
      typeId: 'delegationSubtensor',
      provider: chain.name,
      actionLink: `?action=stake&type=subtensor&chain=${chain.id ?? ''}`,
      nativeToken: chain.nativeToken,
      genesisHash: chain.genesisHash,
    }
  })

  return subtensorProviders
}

export default useSubtensorProviders
