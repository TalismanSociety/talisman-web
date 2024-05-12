import { selectedSubstrateAccountsState } from '../../../accounts'
import { dappStakingEnabledChainsState, nativeTokenAmountState } from '../../../chains'
import { chainQueryState } from '../../../common'
import { Maybe } from '../../../../util/monads'
import { useMemo } from 'react'
import { constSelector, useRecoilValue, waitForAll, waitForAny } from 'recoil'

export const useTotalStaked = () => {
  const [chains, accounts] = useRecoilValue(waitForAll([dappStakingEnabledChainsState, selectedSubstrateAccountsState]))

  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const [nativeTokenAmounts, ledgerLoadables] = useRecoilValue(
    chains.length <= 0
      ? constSelector(undefined)
      : waitForAll([
          waitForAny(
            chains.map(chain =>
              nativeTokenAmountState({
                genesisHash: chain.genesisHash,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                apiEndpoint: chain.rpc!,
              })
            )
          ),
          waitForAny(
            chains.map(chain =>
              waitForAll([
                chainQueryState(chain.rpc, 'dappStaking', 'activeProtocolState', []),
                chainQueryState(chain.rpc, 'dappStaking', 'ledger.multi', addresses),
              ])
            )
          ),
        ])
  ) ?? [undefined, undefined]

  if (nativeTokenAmounts === undefined || ledgerLoadables === undefined) {
    return 0
  }

  return ledgerLoadables
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

            return nativeTokenAmounts.at(chainIndex)?.valueMaybe()?.fromPlanck(staked).fiatAmount ?? 0
          })
          .reduce((prev, curr) => prev + curr, 0) ?? 0
      )
    })
    .reduce((prev, curr) => prev + curr, 0)
}
