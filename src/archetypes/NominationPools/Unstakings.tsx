import Text from '@components/atoms/Text'
import PoolUnstake, { PoolUnstakeList } from '@components/recipes/PoolUnstake'
import { selectedPolkadotAccountsState } from '@domains/accounts/recoils'
import { createAccounts } from '@domains/nominationPools/utils'
import { BN } from '@polkadot/util'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import useChainState from '../../domains/common/hooks/useChainState'
import useExtrinsic from '../../domains/common/hooks/useExtrinsic'

const Unstakings = () => {
  const withdrawExtrinsic = useExtrinsic('nominationPools', 'withdrawUnbonded')

  const sessionProgressLoadable = useChainState('derive', 'session', 'progress', [])

  const [api, accounts, decimalFromAtomics, nativeTokenPrice] = useRecoilValue(
    waitForAll([apiState, selectedPolkadotAccountsState, nativeTokenDecimalState, nativeTokenPriceState('usd')])
  )

  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address)
  )

  const slashingSpans = useChainState(
    'query',
    'staking',
    'slashingSpans.multi',
    poolMembersLoadable.valueMaybe()?.map(x => createAccounts(api, x.unwrapOrDefault().poolId).stashId) ?? []
  )

  const unstakings = useMemo(() => {
    if (sessionProgressLoadable.state !== 'hasValue' || poolMembersLoadable.state !== 'hasValue') {
      return undefined
    }

    return poolMembersLoadable.contents.flatMap((pool, index) => {
      const address = accounts[index]?.address

      const all = Array.from(pool.unwrapOrDefault().unbondingEras.entries(), ([era, amount]) => ({
        address: address,
        pool: pool.unwrapOrDefault(),
        amount,
        erasTilWithdrawable: era.lte(sessionProgressLoadable.contents.activeEra)
          ? undefined
          : era.sub(sessionProgressLoadable.contents.activeEra),
      }))

      const withdrawables = all.filter(x => x.erasTilWithdrawable === undefined)
      const pendings = all.filter(x => x.erasTilWithdrawable !== undefined)

      if (withdrawables.length === 0) return pendings

      return [
        { ...withdrawables[0], amount: withdrawables.reduce((prev, curr) => prev.add(curr.amount), new BN(0)) },
        ...pendings,
      ]
    })
  }, [
    sessionProgressLoadable.state,
    sessionProgressLoadable.contents.activeEra,
    poolMembersLoadable.state,
    poolMembersLoadable.contents,
    accounts,
  ])

  if (sessionProgressLoadable.state !== 'hasValue') return null

  if (unstakings?.length === 0) return null

  return (
    <div>
      <header css={{ marginTop: '4rem' }}>
        <Text.H4 css={{ marginBottom: '2.4rem' }}>Unstaking</Text.H4>
      </header>
      <PoolUnstakeList>
        {unstakings?.map((x, index) => (
          <PoolUnstake
            key={index}
            accountName={accounts.find(({ address }) => address === x.address)?.name ?? ''}
            accountAddress={x.address ?? ''}
            unstakingAmount={decimalFromAtomics.fromAtomics(x.amount).toHuman()}
            unstakingFiatAmount={(
              decimalFromAtomics.fromAtomics(x.amount).toNumber() * nativeTokenPrice
            ).toLocaleString(undefined, {
              style: 'currency',
              currency: 'usd',
              currencyDisplay: 'narrowSymbol',
            })}
            timeTilWithdrawable={
              x.erasTilWithdrawable === undefined
                ? undefined
                : formatDistanceToNow(
                    addMilliseconds(
                      new Date(),
                      x.erasTilWithdrawable
                        .subn(1)
                        .mul(sessionProgressLoadable.contents.eraLength)
                        .add(sessionProgressLoadable.contents.eraLength)
                        .sub(sessionProgressLoadable.contents.eraProgress)
                        .mul(api.consts.babe.expectedBlockTime)
                        .toNumber()
                    )
                  )
            }
            onRequestWithdraw={() => {
              if (x.address === undefined) return
              const priorLength = slashingSpans.valueMaybe()?.[index]?.unwrapOr(undefined)?.prior.length
              withdrawExtrinsic.signAndSend(x.address, x.address, priorLength === undefined ? 0 : priorLength + 1)
            }}
            withdrawState={
              withdrawExtrinsic.state === 'loading' && withdrawExtrinsic.parameters?.[1] === x.address
                ? withdrawExtrinsic.parameters?.[1] === x.address
                  ? 'pending'
                  : 'disabled'
                : undefined
            }
          />
        ))}
      </PoolUnstakeList>
    </div>
  )
}

export default Unstakings
