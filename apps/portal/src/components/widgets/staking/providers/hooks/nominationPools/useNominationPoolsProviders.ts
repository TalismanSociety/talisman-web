import { useRecoilValueLoadable, waitForAll } from 'recoil'

import { chainState, nominationPoolsEnabledChainsState } from '@/domains/chains'

import { Provider } from '../useProvidersData'

const useNominationPoolsProviders = (): Provider[] => {
  const nominationPoolsLoadable = useRecoilValueLoadable(nominationPoolsEnabledChainsState)
  const nominationPools = nominationPoolsLoadable.valueMaybe()
  const chainsLoadable = useRecoilValueLoadable(
    waitForAll(nominationPools?.map(({ genesisHash }) => chainState({ genesisHash })) ?? [])
  )
  const chains = chainsLoadable.valueMaybe() ?? []

  const nominationPoolProviders: Provider[] =
    nominationPools?.map(({ id, nativeToken, rpc, genesisHash }, index) => {
      const chain = chains[index]
      return {
        symbol: nativeToken?.symbol ?? '',
        logo: nativeToken?.logo ?? '',
        chainName: chain?.name ?? '',
        chainId: id,
        type: 'Nomination pool' as Provider['type'],
        typeId: 'nominationPool',
        provider: chain?.name,
        actionLink: `?action=stake&type=nomination-pools&chain=${id}`,
        nativeToken,
        rpc,
        genesisHash,
      }
    }) ?? []

  return nominationPoolProviders
}

export default useNominationPoolsProviders
