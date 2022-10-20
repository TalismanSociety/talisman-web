import Button from '@components/atoms/Button'
import Text from '@components/atoms/Text'
import HiddenDetails from '@components/molecules/HiddenDetails'
import PoolStake, { PoolStakeList } from '@components/recipes/PoolStake/PoolStake'
import PoolUnstake, { PoolUnstakeList } from '@components/recipes/PoolUnstake'
import { selectedPolkadotAccountsState } from '@domains/accounts/recoils'
import { createAccounts } from '@domains/nominationPools/utils'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue, waitForAll } from 'recoil'

import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import useChainState from '../../domains/common/hooks/useChainState'
import useExtrinsic from '../../domains/common/hooks/useExtrinsic'
import { allPendingPoolRewardsState } from '../../domains/nominationPools/recoils'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

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

  const unstakings = useMemo(
    () =>
      sessionProgressLoadable.state !== 'hasValue' || poolMembersLoadable.state !== 'hasValue'
        ? undefined
        : poolMembersLoadable.contents.flatMap((pool, index) =>
            Array.from(pool.unwrapOrDefault().unbondingEras.entries(), ([era, amount]) => ({
              address: accounts[index]?.address ?? '',
              pool: pool.unwrapOrDefault(),
              era,
              amount,
              erasTilWithdrawable: era.lte(sessionProgressLoadable.contents.activeEra)
                ? undefined
                : era.sub(sessionProgressLoadable.contents.activeEra),
            }))
          ),
    [
      sessionProgressLoadable.state,
      sessionProgressLoadable.contents.activeEra,
      poolMembersLoadable.state,
      poolMembersLoadable.contents,
      accounts,
    ]
  )

  if (sessionProgressLoadable.state !== 'hasValue') return null

  if (unstakings?.length === 0) return null

  return (
    <div>
      <header css={{ marginTop: '4rem' }}>
        <Text.H4>Unstaking</Text.H4>
      </header>
      <PoolUnstakeList>
        {unstakings?.map((x, index) => (
          <PoolUnstake
            key={index}
            accountName={accounts.find(({ address }) => address === x.address)?.name ?? ''}
            accountAddress={x.address}
            unstakingAmount={decimalFromAtomics.fromAtomics(x.amount).toHuman()}
            unstakingFiatAmount={(
              decimalFromAtomics.fromAtomics(x.amount).toFloatApproximation() * nativeTokenPrice
            ).toLocaleString(undefined, {
              style: 'currency',
              currency: 'usd',
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
              const priorLength = slashingSpans.valueMaybe()?.[index]?.unwrapOr(undefined)?.prior.length
              withdrawExtrinsic.signAndSend(x.address, x.address, priorLength === undefined ? 0 : priorLength + 1)
            }}
            withdrawState={withdrawExtrinsic.state === 'loading' ? 'pending' : undefined}
          />
        ))}
      </PoolUnstakeList>
    </div>
  )
}

const Stakings = () => {
  const claimPayoutExtrinsic = useExtrinsic('nominationPools', 'claimPayout')
  const unbondExtrinsic = useExtrinsic('nominationPools', 'unbond')

  const [pendingRewards, accounts, decimalFromAtomics, nativeTokenPrice] = useRecoilValue(
    waitForAll([
      allPendingPoolRewardsState,
      selectedPolkadotAccountsState,
      nativeTokenDecimalState,
      nativeTokenPriceState('usd'),
    ])
  )

  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address)
  )

  const poolMetadatumLoadable = useChainState(
    'query',
    'nominationPools',
    'metadata.multi',
    poolMembersLoadable.valueMaybe()?.map(x => x.unwrapOrDefault().poolId) ?? [],
    { enabled: poolMembersLoadable.state === 'hasValue' }
  )

  const pools = useMemo(
    () =>
      poolMembersLoadable.state !== 'hasValue'
        ? undefined
        : poolMembersLoadable.contents
            .map((poolMember, index) => {
              return {
                account: accounts[index],
                poolName: poolMetadatumLoadable.valueMaybe()?.[index]?.toUtf8(),
                poolMember,
                pendingRewards: pendingRewards.find(rewards => rewards[0] === accounts[index]?.address)?.[1],
              }
            })
            .filter(x => x.poolMember.isSome),
    [poolMembersLoadable.state, poolMembersLoadable.contents, accounts, poolMetadatumLoadable, pendingRewards]
  )

  const [unstakeAccount, setUnstakeAccount] = useState<string>()
  const [addStakeAccount, setAddStakeAccount] = useState<string>()

  useEffect(() => {
    if (unbondExtrinsic.state === 'loading' && unbondExtrinsic.contents?.status.isBroadcast) {
      setUnstakeAccount(undefined)
    }
  }, [unbondExtrinsic.contents?.status?.isBroadcast, unbondExtrinsic.state])

  return (
    <div>
      <AddStakeDialog account={addStakeAccount} onDismiss={useCallback(() => setAddStakeAccount(undefined), [])} />
      <UnstakeDialog account={unstakeAccount} onDismiss={useCallback(() => setUnstakeAccount(undefined), [])} />
      <header>
        <Text.H4>Staking</Text.H4>
      </header>
      {pools?.length === 0 && (
        <HiddenDetails
          hidden
          overlay={
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '3.2rem',
              }}
            >
              <Text.Body>You have no staked assets yet...</Text.Body>
              <Button as={Link} variant="outlined" to="/staking">
                Get started
              </Button>
            </div>
          }
        >
          <PoolStakeList>
            <PoolStake.Skeleton animate={false} />
            <PoolStake.Skeleton animate={false} />
            <PoolStake.Skeleton animate={false} />
          </PoolStakeList>
        </HiddenDetails>
      )}
      <PoolStakeList>
        {pools?.map(pool => (
          <PoolStake
            accountName={pool.account?.name ?? ''}
            accountAddress={pool.account?.address ?? ''}
            stakingAmount={decimalFromAtomics.fromAtomics(pool.poolMember.unwrapOrDefault().points).toHuman()}
            stakingAmountInFiat={(
              decimalFromAtomics.fromAtomics(pool.poolMember.unwrapOrDefault().points).toFloatApproximation() *
              nativeTokenPrice
            ).toLocaleString(undefined, { style: 'currency', currency: 'usd' })}
            rewardsAmount={decimalFromAtomics.fromAtomics(pool.pendingRewards?.toString()).toHuman()}
            rewardsAmountInFiat={(
              decimalFromAtomics.fromAtomics(pool.pendingRewards).toFloatApproximation() * nativeTokenPrice
            ).toLocaleString(undefined, { style: 'currency', currency: 'usd' })}
            poolName={pool.poolName ?? ''}
            onRequestClaim={() => claimPayoutExtrinsic.signAndSend(pool.account?.address ?? '')}
            claimState={
              pool.pendingRewards?.isZero() ?? true
                ? 'unavailable'
                : claimPayoutExtrinsic.state === 'loading'
                ? 'pending'
                : undefined
            }
            onRequestUnstake={() => setUnstakeAccount(pool.account?.address)}
            unstakeState={
              pool.poolMember.unwrapOrDefault().points.isZero()
                ? 'unavailable'
                : unbondExtrinsic.state === 'loading'
                ? 'pending'
                : undefined
            }
            onRequestAdd={() => setAddStakeAccount(pool.account?.address)}
          />
        ))}
      </PoolStakeList>
    </div>
  )
}

const OwnPools = () => {
  return (
    <div id="staking">
      <Suspense
        fallback={
          <div>
            <header>
              <Text.H4>Staking</Text.H4>
              <PoolStakeList>
                <PoolStake.Skeleton />
                <PoolStake.Skeleton />
                <PoolStake.Skeleton />
              </PoolStakeList>
            </header>
          </div>
        }
      >
        <Stakings />
        <Unstakings />
      </Suspense>
    </div>
  )
}

export default OwnPools
