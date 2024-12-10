import { useRecoilValue } from 'recoil'

import { dappStakingEnabledChainsState } from '@/domains/chains/recoils'

import { Provider } from '../types'

const useDappProviders = (): Provider[] => {
  const chains = useRecoilValue(dappStakingEnabledChainsState)
  const dappProviders: Provider[] = chains.map(chain => {
    return {
      symbol: chain.nativeToken?.symbol ?? '',
      logo: chain.nativeToken?.logo ?? '',
      chainName: chain.name ?? '',
      chainId: chain.id,
      type: 'DApp staking' as Provider['type'],
      typeId: 'dappStaking',
      provider: chain.name,
      actionLink: `?action=stake&type=dapp-staking&chain=${chain?.id ?? ''}`,
      nativeToken: chain.nativeToken,
      genesisHash: chain.genesisHash,
    }
  })
  return dappProviders
}

export default useDappProviders
