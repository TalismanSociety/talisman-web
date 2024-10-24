import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { chainDeriveState } from '@/domains/common'
import { Maybe } from '@/util/monads'
import { usePolkadotApiId, useQueryState } from '@talismn/react-polkadot-api'
import { BigNumber } from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

const useStakePercentage = () => {
  const apiId = usePolkadotApiId()
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const balances = useRecoilValue(
    waitForAll(addresses.map(address => chainDeriveState(apiId, 'balances', 'all', [address])))
  )
  const total = useMemo(() => balances.reduce((prev, curr) => prev + curr.freeBalance.toBigInt(), 0n), [balances])
  const [activeProtocol, ledgers] = useRecoilValue(
    waitForAll([
      useQueryState('dappStaking', 'activeProtocolState', []),
      useQueryState('dappStaking', 'ledger.multi', addresses),
    ])
  )
  const staked = useMemo(
    () =>
      ledgers.reduce(
        (prev, curr) =>
          prev +
          Maybe.of(
            [curr.stakedFuture.unwrapOrDefault(), curr.staked].find(x =>
              x.period.unwrap().eq(activeProtocol.periodInfo.number.unwrap())
            )
          ).mapOr(0n, x => x.voting.toBigInt() + x.buildAndEarn.toBigInt()),
        0n
      ),
    [activeProtocol.periodInfo.number, ledgers]
  )

  const stakePercentage = useMemo(
    () => (staked === 0n ? 0 : new BigNumber(staked.toString()).div(total.toString()).toNumber()),
    [staked, total]
  )

  return stakePercentage
}

export default useStakePercentage
