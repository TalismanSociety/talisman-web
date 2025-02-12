import { useRecoilValue } from 'recoil'

import { subtensorStakingEnabledChainsState } from '@/domains/chains/recoils'

import { DTAO_SYMBOL } from '../../../subtensor/constants'
import { Provider } from '../types'

const useSubtensorProviders = () => {
  const chains = useRecoilValue(subtensorStakingEnabledChainsState)

  const subtensorProviders: Provider[] = chains.map(chain => {
    return {
      symbol: chain.hasDTaoStaking ? DTAO_SYMBOL : chain.nativeToken?.symbol ?? '',
      logo: chain.nativeToken?.logo ?? '',
      chainName: chain.name ?? '',
      chainId: chain.id,
      type: chain.hasDTaoStaking ? 'Subnet Staking' : 'Delegation',
      typeId: 'delegationSubtensor',
      provider: chain.name,
      actionLink: `?action=stake&type=subtensor&chain=${chain.id ?? ''}`,
      nativeToken: chain.nativeToken,
      genesisHash: chain.genesisHash,
      hasDTaoStaking: chain.hasDTaoStaking,
    }
  })

  return subtensorProviders
}

export default useSubtensorProviders
