import Text from '@components/atoms/Text'
import AddStakeDialog from '@components/recipes/AddStakeDialog'
import PoolStake, { PoolStakeList } from '@components/recipes/PoolStake/PoolStake'
import PoolUnstake, { PoolUnstakeList } from '@components/recipes/PoolUnstake'
import UnstakeAlertDialog from '@components/recipes/UnstakeAlertDialog'
import { createAccounts } from '@domains/nomiationPools/utils'
import { BN } from '@polkadot/util'
import { addMilliseconds, formatDistance, formatDistanceToNow } from 'date-fns'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import useChainState from '../../domains/common/hooks/useChainState'
import useExtrinsic from '../../domains/common/hooks/useExtrinsic'
import { accountsState } from '../../domains/extension/recoils'
import { allPendingPoolRewardsState } from '../../domains/nomiationPools/recoils'

const AddDialog = (props: { account?: string; onDismiss: () => unknown }) => {
  const bondExtraExtrinsic = useExtrinsic('nominationPools', 'bondExtra')
  const balanceLoadable = useChainState('derive', 'balances', 'all', [props.account!], {
    enabled: props.account !== undefined,
  })
  const poolMemberLoadable = useChainState('query', 'nominationPools', 'poolMembers', [props.account!], {
    enabled: props.account !== undefined,
  })
  const [nativeTokenDecimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([nativeTokenDecimalState, nativeTokenPriceState('usd')])
  )

  const [amount, setAmount] = useState('')

  const amountDecimal = useMemo(() => {
    try {
      return nativeTokenDecimal.fromUserInput(amount)
    } catch {
      return undefined
    }
  }, [amount, nativeTokenDecimal])

  const poolPointsDecimal = useMemo(
    () => nativeTokenDecimal.fromAtomics(poolMemberLoadable.valueMaybe()?.unwrapOrDefault().points),
    [nativeTokenDecimal, poolMemberLoadable]
  )

  const newAmount = useMemo(
    () => nativeTokenDecimal.fromAtomics(poolPointsDecimal.atomics.add(amountDecimal?.atomics ?? new BN(0))),
    [amountDecimal?.atomics, nativeTokenDecimal, poolPointsDecimal.atomics]
  )

  return (
    <AddStakeDialog
      open={props.account !== undefined}
      availableToStake={nativeTokenDecimal.fromAtomics(balanceLoadable.valueMaybe()?.freeBalance).toHuman() ?? ''}
      amount={amount}
      onChangeAmount={setAmount}
      fiatAmount={(amountDecimal?.toFloatApproximation() ?? 0 * nativeTokenPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'usd',
      })}
      newAmount={newAmount.toHuman()}
      newFiatAmount={(newAmount.toFloatApproximation() * nativeTokenPrice).toLocaleString(undefined, {
        style: 'currency',
        currency: 'usd',
      })}
      onDismiss={props.onDismiss}
      onConfirm={useCallback(
        () =>
          bondExtraExtrinsic
            .signAndSend(props.account ?? '', {
              FreeBalance: amountDecimal?.atomics?.toString() ?? '0',
            })
            .then(() => props.onDismiss()),
        [amountDecimal?.atomics, bondExtraExtrinsic, props]
      )}
      onRequestMaxAmount={() =>
        setAmount(nativeTokenDecimal.fromAtomics(balanceLoadable.valueMaybe()?.freeBalance).toString())
      }
      confirmState={bondExtraExtrinsic.state === 'loading' ? 'pending' : undefined}
    />
  )
}

const Unstakings = () => {
  const withdrawExtrinsic = useExtrinsic('nominationPools', 'withdrawUnbonded')

  const activeEraLoadable = useChainState('derive', 'session', 'progress', [])
  const expectedEraTimeLoadable = useChainState('derive', 'session', 'eraLength', [])

  const [api, accounts, decimalFromAtomics, nativeTokenPrice] = useRecoilValue(
    waitForAll([apiState, accountsState, nativeTokenDecimalState, nativeTokenPriceState('usd')])
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
    poolMembersLoadable.valueMaybe()?.map(x => createAccounts(api, x.unwrapOrDefault().poolId).stashId) ?? [],
    { enabled: poolMembersLoadable.state === 'hasValue' }
  )

  const unstakings = useMemo(
    () =>
      activeEraLoadable.state !== 'hasValue' || poolMembersLoadable.state !== 'hasValue'
        ? undefined
        : poolMembersLoadable.contents.flatMap((pool, index) =>
            Array.from(pool.unwrapOrDefault().unbondingEras.entries(), ([era, amount]) => ({
              address: accounts[index].address,
              pool: pool.unwrapOrDefault(),
              era,
              amount,
              erasTilWithdrawable: era.lte(activeEraLoadable.contents.currentEra)
                ? undefined
                : era.sub(activeEraLoadable.contents.currentEra),
            }))
          ),
    [
      activeEraLoadable.state,
      activeEraLoadable.contents.currentEra,
      poolMembersLoadable.state,
      poolMembersLoadable.contents,
      accounts,
    ]
  )

  if (activeEraLoadable.state === 'loading' || expectedEraTimeLoadable.state === 'loading') return null

  return (
    <div>
      <header css={{ marginTop: '4rem' }}>
        <Text.H4>Unstaking</Text.H4>
      </header>
      {expectedEraTimeLoadable.state === 'hasValue' && (
        <PoolUnstakeList>
          {unstakings?.map((x, index) => (
            <PoolUnstake
              key={index}
              accountName={accounts.find(({ address }) => (address = x.address))?.name ?? ''}
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
                          .mul(expectedEraTimeLoadable.contents.mul(api.consts.babe.expectedBlockTime))
                          .toNumber()
                      )
                    )
              }
              onRequestWithdraw={() => {
                const priorLength = slashingSpans.valueMaybe()?.[index].unwrapOr(undefined)?.prior.length
                withdrawExtrinsic.signAndSend(x.address, x.address, priorLength === undefined ? 0 : priorLength + 1)
              }}
            />
          ))}
        </PoolUnstakeList>
      )}
    </div>
  )
}

const Stakings = () => {
  const claimPayoutExtrinsic = useExtrinsic('nominationPools', 'claimPayout')
  const unbondExtrinsic = useExtrinsic('nominationPools', 'unbond')

  const expectedEraTimeLoadable = useChainState('derive', 'session', 'eraLength', [])

  const [api, pendingRewards, accounts, decimalFromAtomics, nativeTokenPrice] = useRecoilValue(
    waitForAll([
      apiState,
      allPendingPoolRewardsState,
      accountsState,
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
    poolMembersLoadable.state !== 'hasValue' ? [] : poolMembersLoadable.contents.map(x => x.unwrapOrDefault().poolId)
  )

  const lockDuration = useMemo(
    () =>
      expectedEraTimeLoadable
        .valueMaybe()
        ?.mul(api.consts.staking.bondingDuration)
        .mul(api.consts.babe.expectedBlockTime),
    [api.consts.babe.expectedBlockTime, api.consts.staking.bondingDuration, expectedEraTimeLoadable]
  )

  const pools = useMemo(
    () =>
      poolMembersLoadable.state !== 'hasValue'
        ? undefined
        : poolMembersLoadable.contents
            .map((poolMember, index) => {
              return {
                account: accounts[index],
                poolName:
                  poolMetadatumLoadable.state !== 'hasValue'
                    ? undefined
                    : (poolMetadatumLoadable.contents[index]?.toUtf8() as string),
                poolMember,
                pendingRewards: pendingRewards.find(rewards => rewards[0] === accounts[index].address)?.[1],
              }
            })
            .filter(x => x.poolMember.isSome),
    [
      poolMembersLoadable.state,
      poolMembersLoadable.contents,
      accounts,
      poolMetadatumLoadable.state,
      poolMetadatumLoadable.contents,
      pendingRewards,
    ]
  )

  const [currentUnstake, setCurrentUnstake] = useState<{ address: string; points: any }>()
  const [addStakeAccount, setAddStakeAccount] = useState<string>()

  return (
    <div>
      <AddDialog account={addStakeAccount} onDismiss={useCallback(() => setAddStakeAccount(undefined), [])} />
      <UnstakeAlertDialog
        open={currentUnstake !== undefined}
        amount={decimalFromAtomics.fromAtomics(currentUnstake?.points).toHuman()}
        fiatAmount={decimalFromAtomics
          .fromAtomics(currentUnstake?.points)
          .toFloatApproximation()
          .toLocaleString(undefined, {
            style: 'currency',
            currency: 'usd',
          })}
        lockDuration={formatDistance(0, lockDuration?.toNumber() ?? 0)}
        onDismiss={() => setCurrentUnstake(undefined)}
        onConfirm={() => {
          if (currentUnstake) {
            unbondExtrinsic.signAndSend(currentUnstake?.address, currentUnstake?.address, currentUnstake.points)
          }
          setCurrentUnstake(undefined)
        }}
      />
      <header>
        <Text.H4>Staking</Text.H4>
      </header>
      <PoolStakeList>
        {pools?.map(pool => (
          <PoolStake
            accountName={pool.account.name ?? ''}
            accountAddress={pool.account.address}
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
            onRequestClaim={() => claimPayoutExtrinsic.signAndSend(pool.account.address)}
            claimState={
              pool.pendingRewards?.isZero() ?? true
                ? 'unavailable'
                : claimPayoutExtrinsic.state === 'loading'
                ? 'pending'
                : undefined
            }
            onRequestUnstake={() =>
              setCurrentUnstake({
                address: pool.account.address,
                points: pool.poolMember.unwrapOrDefault().points ?? 0,
              })
            }
            unstakeState={
              pool.poolMember.unwrapOrDefault().points.isZero()
                ? 'unavailable'
                : unbondExtrinsic.state === 'loading'
                ? 'pending'
                : undefined
            }
            onRequestAdd={() => setAddStakeAccount(pool.account.address)}
          />
        ))}
      </PoolStakeList>
    </div>
  )
}

const OwnPools = () => {
  return (
    <div>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Stakings />
      </Suspense>
      <Suspense>
        <Unstakings />
      </Suspense>
    </div>
  )
}

export default OwnPools
