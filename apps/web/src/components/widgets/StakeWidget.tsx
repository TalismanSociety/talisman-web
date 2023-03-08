import PoolSelectorDialog from '@components/recipes/PoolSelectorDialog'
import { PoolStatus } from '@components/recipes/PoolStatusIndicator'
import StakeDialogComponent from '@components/recipes/StakeDialog'
import StakingInput from '@components/recipes/StakingInput'
import { injectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { apiState, chainState, nativeTokenDecimalState } from '@domains/chains/recoils'
import { useChainState, useExtrinsic, useTokenAmountFromPlanck } from '@domains/common/hooks'
import { usePoolAddForm } from '@domains/nominationPools/hooks'
import { eraStakersState, recommendedPoolsState } from '@domains/nominationPools/recoils'
import { createAccounts } from '@domains/nominationPools/utils'
import { shortenAddress } from '@util/format'
import { Maybe } from '@util/monads'
import BN from 'bn.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-use'
import { atom, constSelector, useRecoilState, useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

const PoolSelector = (props: {
  open: boolean
  selectedPoolId?: number
  onChangePoolId: (poolId: number) => unknown
  onDismiss: () => unknown
}) => {
  const [newPoolId, setNewPoolId] = useState<number>()
  const [recommendedPools, nativeTokenDecimal, currentChain] = useRecoilValue(
    waitForAll([recommendedPoolsState, nativeTokenDecimalState, chainState])
  )

  return (
    <PoolSelectorDialog
      open={props.open}
      onRequestDismiss={useCallback(() => {
        props.onDismiss()
        setNewPoolId(undefined)
      }, [props])}
      onConfirm={useCallback(() => {
        if (newPoolId !== undefined) {
          props.onChangePoolId(newPoolId)
          setNewPoolId(undefined)
        }
        props.onDismiss()
      }, [newPoolId, props])}
    >
      {recommendedPools.map((pool, index) => (
        <PoolSelectorDialog.Item
          key={pool.poolId}
          selected={props.selectedPoolId !== undefined && pool.poolId === props.selectedPoolId}
          highlighted={newPoolId !== undefined && pool.poolId === newPoolId}
          talismanRecommended={index === 0}
          poolName={pool.name ?? ''}
          poolDetailUrl={
            currentChain.subscanUrl === null
              ? undefined
              : new URL(`nomination_pool/${pool.poolId}`, currentChain.subscanUrl).toString()
          }
          stakedAmount={`${nativeTokenDecimal.fromPlanck(pool.bondedPool.points).toHuman()} staked`}
          rating={3}
          memberCount={pool.bondedPool.memberCounter.toString()}
          onClick={() => setNewPoolId(pool.poolId)}
        />
      ))}
    </PoolSelectorDialog>
  )
}

const StakeInput = () => {
  const joinPoolExtrinsic = useExtrinsic('nominationPools', 'join')

  const location = useLocation()

  const poolIdFromSearch = useMemo(
    () =>
      Maybe.of(new URLSearchParams(location.search).get('poolId')).mapOrUndefined(x => {
        try {
          return parseInt(x)
        } catch {}
      }),
    [location.search]
  )

  const [api, accounts, recommendedPools] = useRecoilValue(
    waitForAll([apiState, injectedSubstrateAccountsState, recommendedPoolsState])
  )

  const initialPoolId = poolIdFromSearch ?? recommendedPools[0]?.poolId

  const [selectedPoolId, setSelectedPoolId] = useState(initialPoolId)
  const [showPoolSelector, setShowPoolSelector] = useState(false)

  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0)
  const selectedAccount = accounts[selectedAccountIndex]

  const {
    input: { amount, decimalAmount, localizedFiatAmount },
    isReady: isInputReady,
    availableBalance,
    error: inputError,
    setAmount,
  } = usePoolAddForm('join', selectedAccount?.address)

  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address),
    {
      enabled: accounts.length > 0,
    }
  )

  const activeEraLoadable = useChainState('query', 'staking', 'activeEra', [])
  const eraStakersLoadable = useRecoilValueLoadable(
    activeEraLoadable.state !== 'hasValue'
      ? constSelector(undefined)
      : eraStakersState(activeEraLoadable.contents.unwrapOrDefault().index)
  ).map(value => new Set(value?.map(x => x[0].args[1].toHuman())))

  const existingPool =
    poolMembersLoadable.state === 'hasValue' && poolMembersLoadable.contents[selectedAccountIndex]?.isSome
      ? poolMembersLoadable.contents[selectedAccountIndex]!.unwrap()
      : undefined

  const poolNominatorsLoadable = useChainState(
    'query',
    'staking',
    'nominators.multi',
    existingPool === undefined
      ? [createAccounts(api, new BN(selectedPoolId ?? 0)).stashId]
      : [
          createAccounts(api, new BN(selectedPoolId ?? 0)).stashId,
          createAccounts(api, new BN(existingPool.poolId ?? 0)).stashId,
        ],
    { enabled: selectedPoolId !== undefined }
  )

  const poolStatus = useMemo<PoolStatus | undefined>(() => {
    if (eraStakersLoadable.state !== 'hasValue' || poolNominatorsLoadable.state !== 'hasValue') {
      return undefined
    }

    if (poolNominatorsLoadable.contents[0]?.unwrapOrDefault().targets.length === 0) {
      return 'not_nominating'
    }

    return poolNominatorsLoadable.contents[0]
      ?.unwrapOrDefault()
      .targets.some(x => eraStakersLoadable.contents.has(x.toHuman()))
      ? 'earning_rewards'
      : 'waiting'
  }, [
    eraStakersLoadable.contents,
    eraStakersLoadable.state,
    poolNominatorsLoadable.contents,
    poolNominatorsLoadable.state,
  ])

  const bondedPoolLoadable = useChainState('query', 'nominationPools', 'bondedPools', [selectedPoolId!], {
    enabled: selectedPoolId !== undefined,
  })

  const { decimalAmount: poolTotalStaked } = useTokenAmountFromPlanck(
    bondedPoolLoadable.valueMaybe()?.unwrapOrDefault().points
  )

  const poolMetadataLoadable = useChainState(
    'query',
    'nominationPools',
    'metadata.multi',
    existingPool === undefined
      ? [selectedPoolId!]
      : selectedPoolId === undefined
      ? [existingPool.poolId, existingPool.poolId]
      : [selectedPoolId!, existingPool.poolId],
    {
      enabled: selectedPoolId !== undefined || existingPool !== undefined,
    }
  )

  const isReady =
    selectedAccount !== undefined &&
    decimalAmount !== undefined &&
    poolMembersLoadable.state === 'hasValue' &&
    isInputReady

  useEffect(() => {
    setSelectedPoolId(initialPoolId)
  }, [initialPoolId, recommendedPools])

  return (
    <>
      <PoolSelector
        open={showPoolSelector}
        selectedPoolId={selectedPoolId}
        onChangePoolId={setSelectedPoolId}
        onDismiss={useCallback(() => setShowPoolSelector(false), [])}
      />
      <StakingInput
        alreadyStaking={existingPool !== undefined}
        accounts={useMemo(
          () =>
            accounts.map(x => ({
              ...x,
              selected: x.address === selectedAccount?.address,
              name: x.name ?? shortenAddress(x.address),
              balance: '',
            })),
          [accounts, selectedAccount?.address]
        )}
        onSelectAccount={useCallback(
          x => setSelectedAccountIndex(accounts.findIndex(account => account.address === x.address)!),
          [accounts]
        )}
        amount={amount}
        fiatAmount={localizedFiatAmount ?? ''}
        onChangeAmount={setAmount}
        isError={inputError !== undefined}
        inputSupportingText={inputError?.message}
        onRequestMaxAmount={() => {
          if (availableBalance.decimalAmount !== undefined) {
            setAmount(availableBalance.decimalAmount.toString())
          }
        }}
        availableToStake={availableBalance.decimalAmount?.toHuman() ?? '...'}
        noPoolsAvailable={recommendedPools.length === 0}
        poolName={poolMetadataLoadable.valueMaybe()?.[0]?.toUtf8() ?? ''}
        poolStatus={poolStatus}
        poolTotalStaked={poolTotalStaked?.toHuman() ?? ''}
        poolMemberCount={bondedPoolLoadable.valueMaybe()?.unwrapOrDefault().memberCounter.toString() ?? ''}
        onRequestPoolChange={useCallback(() => setShowPoolSelector(true), [])}
        onSubmit={useCallback(() => {
          if (selectedAccount !== undefined && decimalAmount?.planck !== undefined && selectedPoolId !== undefined) {
            joinPoolExtrinsic.signAndSend(selectedAccount.address, decimalAmount.planck.toString(), selectedPoolId)
          }
        }, [decimalAmount?.planck, joinPoolExtrinsic, selectedAccount, selectedPoolId])}
        submitState={useMemo(() => {
          if (!isReady || inputError !== undefined || decimalAmount.planck.isZero()) return 'disabled'

          return joinPoolExtrinsic.state === 'loading' ? 'pending' : undefined
        }, [decimalAmount?.planck, inputError, isReady, joinPoolExtrinsic.state])}
        contentAnimation={{
          variants: {
            true: { height: 0 },
            false: { height: 'unset' },
          },
        }}
      />
    </>
  )
}

export const stakeDialogOpenState = atom({ key: 'Widget/StakeDialogOpen', default: false })

const StakeDialog = () => {
  const [open, setOpen] = useRecoilState(stakeDialogOpenState)

  return (
    <StakeDialogComponent
      open={open}
      onRequestDismiss={useCallback(() => setOpen(false), [])}
      stakeInput={<StakeInput />}
      learnMoreAnchor={<StakeDialogComponent.LearnMore />}
    />
  )
}

export default StakeDialog
