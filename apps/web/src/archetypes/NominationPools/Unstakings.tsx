import PoolUnstake, { PoolUnstakeList } from '@components/recipes/PoolUnstake'
import { selectedPolkadotAccountsState } from '@domains/accounts/recoils'
import { erasToMilliseconds } from '@domains/common/utils'
import { usePoolUnlocking } from '@domains/nominationPools/hooks/usePoolUnlocking'
import { createAccounts } from '@domains/nominationPools/utils'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import useChainState from '../../domains/common/hooks/useChainState'
import useExtrinsic from '../../domains/common/hooks/useExtrinsic'

// TODO: Extract individual unstaking items to own reuseable components
const Unstakings = (props: { account?: string; showHeader?: boolean; compact?: boolean }) => {
  const withdrawExtrinsic = useExtrinsic('nominationPools', 'withdrawUnbonded')

  const sessionProgressLoadable = useChainState('derive', 'session', 'progress', [])

  const [api, _accounts, decimalFromAtomics, nativeTokenPrice] = useRecoilValue(
    waitForAll([apiState, selectedPolkadotAccountsState, nativeTokenDecimalState, nativeTokenPriceState('usd')])
  )

  const accounts = useMemo(
    () => (props.account === undefined ? _accounts : _accounts.filter(({ address }) => address === props.account)),
    [_accounts, props.account]
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

  const unstakings = usePoolUnlocking()

  if (sessionProgressLoadable.state !== 'hasValue') return null

  if (unstakings?.length === 0) return null

  return (
    <div>
      <PoolUnstakeList showHeader={props.showHeader}>
        {unstakings?.map((x, index) => (
          <PoolUnstake
            variant={props.compact ? 'compact' : undefined}
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
                      erasToMilliseconds(
                        x.erasTilWithdrawable,
                        sessionProgressLoadable.contents.eraLength,
                        sessionProgressLoadable.contents.eraProgress,
                        api.consts.babe.expectedBlockTime
                      )
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
