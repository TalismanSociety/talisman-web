import { useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll, waitForAny } from 'recoil'

import { selectedSubstrateAccountsState } from '@/domains/accounts/recoils'
import { nativeTokenAmountState, subtensorStakingEnabledChainsState } from '@/domains/chains/recoils'
import { chainQueryState } from '@/domains/common/recoils/query'

export const useTotalStaked = () => {
  const [chains, accounts] = useRecoilValue(
    waitForAll([subtensorStakingEnabledChainsState, selectedSubstrateAccountsState])
  )

  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const nativeTokenAmounts = useRecoilValueLoadable(
    waitForAny(chains.map(chain => nativeTokenAmountState({ genesisHash: chain.genesisHash, apiEndpoint: chain.rpc! })))
  )

  const stakedLoadables = useRecoilValueLoadable(
    waitForAny(
      chains.map(chain =>
        waitForAll(
          // @ts-expect-error
          addresses.map(address => chainQueryState(chain.rpc, 'subtensorModule', 'totalColdkeyStake', [address]))
        )
      )
    )
  )

  if (nativeTokenAmounts.state !== 'hasValue' || stakedLoadables.state !== 'hasValue') return 0

  return stakedLoadables.contents
    .map((loadable, chainIndex) => {
      if (loadable.state !== 'hasValue' || !Array.isArray(loadable.contents)) return 0

      return (
        loadable.contents
          .map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (staked: any) =>
              nativeTokenAmounts.contents.at(chainIndex)?.valueMaybe()?.fromPlanck(staked?.toBigInt?.()).fiatAmount ?? 0
          )
          .reduce((prev, curr) => prev + curr, 0) ?? 0
      )
    })
    .reduce((prev, curr) => prev + curr, 0)
}
