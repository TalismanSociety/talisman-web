import { useRecoilValue } from 'recoil'

import { subtensorStakingEnabledChainsState } from '@/domains/chains/recoils'

import { DTAO_LOGO, DTAO_SYMBOL } from '../../../subtensor/constants'
import { Provider } from '../types'

const useSubtensorProviders = () => {
  const [rootStaking] = useRecoilValue(subtensorStakingEnabledChainsState) ?? {}

  /**
   * Add dTAO staking to the list of providers
   * Has to be added here instead of /chains/config.ts due to the way chainsState selector is implemented,
   *  which doesn't support adding two configs for the same chain genesisHash
   */
  const chains = [rootStaking, rootStaking ? { ...rootStaking, hasDTaoStaking: true } : undefined]

  const subtensorProviders: Provider[] = chains
    .filter(chain => chain !== undefined)
    .map(chain => {
      const actionLink = `?action=stake&type=subtensor&chain=${chain.id ?? ''}`
      return {
        symbol: chain.hasDTaoStaking ? DTAO_SYMBOL : chain.nativeToken?.symbol ?? '',
        logo: chain.hasDTaoStaking ? DTAO_LOGO : chain.nativeToken?.logo ?? '',
        chainName: chain.name ?? '',
        chainId: chain.id,
        type: chain.hasDTaoStaking ? 'Subnet Staking' : 'Delegation',
        typeId: 'delegationSubtensor',
        provider: chain.name,
        actionLink: chain.hasDTaoStaking ? actionLink.concat('&hasDTaoStaking=true') : actionLink,
        nativeToken: chain.nativeToken,
        genesisHash: chain.genesisHash!,
        hasDTaoStaking: chain.hasDTaoStaking,
      }
    })

  return subtensorProviders
}

export default useSubtensorProviders
