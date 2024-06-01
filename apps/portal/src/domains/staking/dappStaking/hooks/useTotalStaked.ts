import { Maybe } from '../../../../util/monads'
import { selectedSubstrateAccountsState } from '../../../accounts'
import { dappStakingEnabledChainsState, nativeTokenAmountState } from '../../../chains'
import { chainQueryState } from '../../../common'
import { useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll, waitForAny } from 'recoil'

export const useTotalStaked = () => {
  const [chains, accounts] = useRecoilValue(waitForAll([dappStakingEnabledChainsState, selectedSubstrateAccountsState]))

  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const nativeTokenAmounts = useRecoilValueLoadable(
    waitForAny(
      chains.map(chain =>
        nativeTokenAmountState({
          genesisHash: chain.genesisHash,
          apiEndpoint: chain.rpc!,
        })
      )
    )
  )

  const ledgerLoadables = useRecoilValueLoadable(
    waitForAny(
      chains.map(chain =>
        waitForAll([
          chainQueryState(chain.rpc, 'dappStaking', 'activeProtocolState', []),
          chainQueryState(chain.rpc, 'dappStaking', 'ledger.multi', addresses),
        ])
      )
    )
  )

  if (nativeTokenAmounts.state !== 'hasValue' || ledgerLoadables.state !== 'hasValue') {
    return 0
  }

  return ledgerLoadables.contents
    .map((x, chainIndex) => {
      if (x.state !== 'hasValue') {
        return 0
      }

      return (
        x.contents[1]
          .map(y => {
            const staked = Maybe.of(
              [y.stakedFuture.unwrapOrDefault(), y.staked].find(z =>
                z.period.unwrap().eq(x.contents[0].periodInfo.number.unwrap())
              )
            ).mapOr(0n, z => z.voting.toBigInt() + z.buildAndEarn.toBigInt())

            return nativeTokenAmounts.contents.at(chainIndex)?.valueMaybe()?.fromPlanck(staked).fiatAmount ?? 0
          })
          .reduce((prev, curr) => prev + curr, 0) ?? 0
      )
    })
    .reduce((prev, curr) => prev + curr, 0)
}
