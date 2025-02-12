import { useRecoilValue } from 'recoil'

import { subtensorStakingEnabledChainsState } from '@/domains/chains/recoils'

import { Provider } from '../types'

const useSubtensorProviders = () => {
  const chains = useRecoilValue(subtensorStakingEnabledChainsState)

  const subtensorProviders: Provider[] = chains.map(chain => {
    return {
      symbol: chain.hasDTaoStaking ? 'Dynamic TAO' : chain.nativeToken?.symbol ?? '',
      logo: chain.nativeToken?.logo ?? '',
      chainName: chain.name ?? '',
      chainId: chain.id,
      type: chain.hasDTaoStaking ? 'Subnet Staking' : 'Delegation',
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
