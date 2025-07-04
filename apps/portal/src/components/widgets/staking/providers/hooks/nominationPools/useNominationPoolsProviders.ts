import { useRecoilValueLoadable, waitForAll } from 'recoil'

import { chainState, nominationPoolsEnabledChainsState } from '@/domains/chains/recoils'

import { Provider } from '../types'

const CERE_GENESIS_HASH = '0x81443836a9a24caaa23f1241897d1235717535711d1d3fe24eae4fdc942c092c'

const useNominationPoolsProviders = (): Provider[] => {
  const nominationPoolsLoadable = useRecoilValueLoadable(nominationPoolsEnabledChainsState)
  const nominationPools = nominationPoolsLoadable.valueMaybe()
  const chainsLoadable = useRecoilValueLoadable(
    waitForAll(nominationPools?.map(({ genesisHash }) => chainState({ genesisHash })) ?? [])
  )
  const chains = chainsLoadable.valueMaybe() ?? []

  const allowedNomPools = nominationPools?.filter(({ genesisHash }) => genesisHash !== CERE_GENESIS_HASH)

  const nominationPoolProviders: Provider[] =
    allowedNomPools?.map(({ id, nativeToken, rpc, genesisHash }, index) => {
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
