import PoolSelectorDialog from '@components/recipes/PoolSelectorDialog'
import StakeFormComponent from '@components/recipes/StakeForm'
import { type StakeStatus } from '@components/recipes/StakeStatusIndicator'
import { writeableSubstrateAccountsState, type Account } from '@domains/accounts/recoils'
import { ChainContext, ChainProvider, chainsState, useNativeTokenDecimalState, type Chain } from '@domains/chains'
import {
  useChainState,
  useEraEtaFormatter,
  useExtrinsic,
  useSubmittableResultLoadableState,
  useSubstrateApiEndpoint,
  useSubstrateApiState,
  useTokenAmountFromPlanck,
} from '@domains/common'
import { useInflation, usePoolAddForm, usePoolStakes } from '@domains/nominationPools/hooks'
import { eraStakersState, useRecommendedPoolsState } from '@domains/nominationPools/recoils'
import { createAccounts } from '@domains/nominationPools/utils'
import { type Decimal } from '@talismn/math'
import { CircularProgressIndicator, Select } from '@talismn/ui'
import { Maybe } from '@util/monads'
import BN from 'bn.js'
import {
  Suspense,
  memo,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-use'
import { constSelector, useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'
import { useAccountSelector } from '../AccountSelector'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'
import ClaimStakeDialog from './ClaimStakeDialog'

const ExistingPool = (props: { account: Account }) => {
  const pool = usePoolStakes({ address: props.account.address })

  const amount = useTokenAmountFromPlanck(pool?.poolMember.points)
  const pendingRewards = useTokenAmountFromPlanck(pool?.pendingRewards)

  const [addStakeAddress, setAddStakeAddress] = useState<string>()

  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const [claimPayoutLoadable, setClaimPayoutLoadable] = useSubmittableResultLoadableState()
  const [restakeLoadable, setRestakeLoadable] = useSubmittableResultLoadableState()

  const [unstakeDialogAddress, setUnstakeDialogAddress] = useState<string>()
  const withdrawExtrinsic = useExtrinsic('nominationPools', 'withdrawUnbonded')

  const decimal = useRecoilValue(useNativeTokenDecimalState())
  const eraEtaFormatter = useEraEtaFormatter()
  const unlocks = pool?.unlockings?.map(x => ({
    amount: decimal.fromPlanck(x.amount).toHuman(),
    eta: eraEtaFormatter(x.erasTilWithdrawable),
  }))

  const unlocking = useTokenAmountFromPlanck(pool?.totalUnlocking ?? 0n)
  const withdrawable = useTokenAmountFromPlanck(pool?.withdrawable)

  return (
    <>
      <StakeFormComponent.ExistingPool
        name={pool?.poolName}
        status={pool?.status}
        amount={amount.decimalAmount?.toHuman()}
        fiatAmount={amount.localizedFiatAmount}
        rewards={pendingRewards.decimalAmount?.toHuman()}
        rewardsFiatAmount={pendingRewards.localizedFiatAmount}
        claimChip={
          pool?.pendingRewards?.isZero() === false && (
            <StakeFormComponent.ExistingPool.ClaimChip
              onClick={() => setClaimDialogOpen(true)}
              loading={claimPayoutLoadable.state === 'loading' || restakeLoadable.state === 'loading'}
            />
          )
        }
        unlocks={unlocks ?? []}
        unlocking={!unlocking.decimalAmount.planck.isZero() && unlocking.decimalAmount.toHuman()}
        unlockingFiatAmount={unlocking.localizedFiatAmount}
        withdrawable={!withdrawable.decimalAmount?.planck.isZero() && withdrawable.decimalAmount?.toHuman()}
        withdrawableFiatAmount={withdrawable.localizedFiatAmount}
        withdrawChip={
          <StakeFormComponent.ExistingPool.WithdrawChip
            onClick={() => {
              void withdrawExtrinsic.signAndSend(props.account.address, props.account.address, pool?.slashingSpan ?? 0)
            }}
            loading={withdrawExtrinsic.state === 'loading'}
          />
        }
        addButton={
          // Fully unbonding pool can't be interacted with
          !pool?.poolMember.points.isZero() && (
            <StakeFormComponent.ExistingPool.AddButton onClick={() => setAddStakeAddress(props.account.address)} />
          )
        }
        unstakeButton={
          // Fully unbonding pool can't be interacted with
          !pool?.poolMember.points.isZero() && (
            <StakeFormComponent.ExistingPool.UnstakeButton
              onClick={() => setUnstakeDialogAddress(props.account.address)}
            />
          )
        }
        readonly={props.account.readonly}
      />
      <AddStakeDialog account={addStakeAddress} onDismiss={() => setAddStakeAddress(undefined)} />
      <ClaimStakeDialog
        open={claimDialogOpen}
        onRequestDismiss={() => setClaimDialogOpen(false)}
        account={props.account}
        onChangeClaimPayoutLoadable={setClaimPayoutLoadable}
        onChangeRestakeLoadable={setRestakeLoadable}
      />
      <UnstakeDialog account={unstakeDialogAddress} onDismiss={() => setUnstakeDialogAddress(undefined)} />
    </>
  )
}

const PoolSelector = (props: {
  open: boolean
  selectedPoolId?: number
  onChangePoolId: (poolId: number) => unknown
  onDismiss: () => unknown
}) => {
  const currentChain = useContext(ChainContext)
  const [newPoolId, setNewPoolId] = useState<number>()
  const [recommendedPools, nativeTokenDecimal] = useRecoilValue(
    waitForAll([useRecommendedPoolsState(), useNativeTokenDecimalState()])
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

export const AssetSelect = (props: {
  selectedChain: Chain
  onSelectChain: (chain: Chain) => unknown
  chains: readonly Chain[]
  inTransition: boolean
  iconSize?: string | number
}) => (
  <Select
    css={{ width: '100%' }}
    value={props.selectedChain.id}
    renderSelected={
      props.inTransition
        ? id => (
            <Select.Option
              leadingIcon={<CircularProgressIndicator size={props.iconSize ?? '2.4rem'} />}
              headlineText={props.chains.find(x => x.id === id)?.nativeToken.symbol}
            />
          )
        : undefined
    }
    onChange={id => {
      const chain = props.chains.find(x => x.id === id)
      if (chain !== undefined) {
        props.onSelectChain(chain)
      }
    }}
  >
    {props.chains.map((x, index) => (
      <Select.Option
        key={index}
        value={x.id}
        leadingIcon={
          <img
            alt={x.nativeToken.symbol}
            src={x.nativeToken.logo}
            css={{ width: props.iconSize ?? '2.4rem', height: props.iconSize ?? '2.4rem' }}
          />
        }
        headlineText={x.nativeToken.symbol}
      />
    ))}
  </Select>
)

const EstimatedYield = memo(
  (props: { amount: Decimal }) => {
    const { stakedReturn } = useInflation()
    const annualReturn = useMemo(() => props.amount.planck.muln(stakedReturn), [props.amount.planck, stakedReturn])
    const parsedAnnualReturn = useTokenAmountFromPlanck(annualReturn)

    return (
      <StakeFormComponent.EstimatedYield
        amount={`${parsedAnnualReturn.decimalAmount.toHuman()} / Year`}
        fiatAmount={parsedAnnualReturn.localizedFiatAmount}
      />
    )
  },
  (previous, current) => previous.amount.planck.eq(current.amount.planck)
)

const DeferredEstimatedYield = (props: { amount: Decimal }) => (
  <EstimatedYield amount={useDeferredValue(props.amount)} />
)

export const ControlledStakeForm = (props: { assetSelector: ReactNode; account?: string }) => {
  const joinPoolExtrinsic = useExtrinsic('nominationPools', 'join')

  const location = useLocation()

  const currentChain = useContext(ChainContext)

  const poolIdFromSearch = useMemo(
    () =>
      Maybe.of(new URLSearchParams(location.search).get('poolId')).mapOrUndefined(x => {
        try {
          return parseInt(x)
        } catch {
          return undefined
        }
      }),
    [location.search]
  )

  const apiEndpoint = useSubstrateApiEndpoint()

  const [api, recommendedPools] = useRecoilValue(waitForAll([useSubstrateApiState(), useRecommendedPoolsState()]))

  const initialPoolId = poolIdFromSearch ?? recommendedPools[0]?.poolId

  const [selectedPoolId, setSelectedPoolId] = useState(initialPoolId)
  const [showPoolSelector, setShowPoolSelector] = useState(false)

  const [selectedAccount, accountSelector] = useAccountSelector(
    useRecoilValue(writeableSubstrateAccountsState),
    accounts =>
      props.account !== undefined
        ? accounts?.find(account => account.address === props.account)
        : // We don't want to select the first account when poolId is present in the URL
        // because we want to showcase that pool & the first account might have already joined one
        poolIdFromSearch === undefined
        ? accounts?.[0]
        : undefined
  )

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
    'poolMembers',
    [selectedAccount?.address ?? ''],
    { enabled: selectedAccount !== undefined }
  )

  const activeEraLoadable = useChainState('query', 'staking', 'activeEra', [])
  const eraStakersLoadable = useRecoilValueLoadable(
    activeEraLoadable.state !== 'hasValue'
      ? constSelector(undefined)
      : eraStakersState({ endpoint: apiEndpoint, era: activeEraLoadable.contents.unwrapOrDefault().index })
  ).map(value => new Set(value?.map(x => x[0].args[1].toHuman())))

  const existingPool =
    poolMembersLoadable.state === 'hasValue' ? poolMembersLoadable.contents.unwrapOr(undefined) : undefined

  const poolNominatorsLoadable = useChainState(
    'query',
    'staking',
    'nominators',
    [createAccounts(api, new BN(selectedPoolId ?? 0)).stashId],
    { enabled: selectedPoolId !== undefined }
  )

  const poolStatus = useMemo<StakeStatus>(() => {
    if (poolNominatorsLoadable.state !== 'hasValue' || eraStakersLoadable.state !== 'hasValue') {
      return
    }

    if (poolNominatorsLoadable.contents.unwrapOrDefault().targets.length === 0) {
      return 'not_nominating'
    }

    return poolNominatorsLoadable.contents
      .unwrapOrDefault()
      .targets.some(x => eraStakersLoadable.contents.has(x.toHuman()))
      ? 'earning_rewards'
      : 'waiting'
  }, [eraStakersLoadable, poolNominatorsLoadable])

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [selectedPoolId!]
      : selectedPoolId === undefined
      ? [existingPool.poolId, existingPool.poolId]
      : [selectedPoolId, existingPool.poolId],
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
        onDismiss={() => setShowPoolSelector(false)}
      />
      <StakeFormComponent
        assetSelector={props.assetSelector}
        accountSelector={accountSelector}
        amountInput={
          <StakeFormComponent.AmountInput
            amount={amount}
            onChangeAmount={setAmount}
            onRequestMaxAmount={() => {
              if (availableBalance.decimalAmount !== undefined) {
                setAmount(availableBalance.decimalAmount.toString())
              }
            }}
            fiatAmount={localizedFiatAmount}
            availableToStake={availableBalance.decimalAmount?.toHuman() ?? '...'}
            error={inputError?.message}
          />
        }
        poolInfo={
          <StakeFormComponent.PoolInfo
            name={poolMetadataLoadable.valueMaybe()?.[0]?.toUtf8() ?? ''}
            status={poolStatus}
            totalStaked={poolTotalStaked?.toHuman() ?? ''}
            memberCount={bondedPoolLoadable.valueMaybe()?.unwrapOrDefault().memberCounter.toString() ?? ''}
            onRequestPoolChange={() => setShowPoolSelector(true)}
            chain={currentChain.id.toString() ?? ''}
          />
        }
        estimatedYield={
          decimalAmount && (
            <Suspense>
              <DeferredEstimatedYield amount={decimalAmount} />
            </Suspense>
          )
        }
        stakeButton={
          <StakeFormComponent.StakeButton
            loading={joinPoolExtrinsic.state === 'loading'}
            disabled={!isReady || inputError !== undefined || decimalAmount.planck.isZero()}
            onClick={() => {
              if (
                selectedAccount !== undefined &&
                decimalAmount?.planck !== undefined &&
                selectedPoolId !== undefined
              ) {
                void joinPoolExtrinsic.signAndSend(
                  selectedAccount.address,
                  decimalAmount.planck.toString(),
                  selectedPoolId
                )
              }
            }}
          />
        }
        existingPool={
          existingPool !== undefined && selectedAccount !== undefined && <ExistingPool account={selectedAccount} />
        }
      />
    </>
  )
}

const StakeForm = () => {
  const chains = useRecoilValue(chainsState)

  const [inTransition, startTransition] = useTransition()
  const [selectedChain, setSelectedChain] = useState<Chain>(chains[0])

  return (
    <ChainProvider chain={selectedChain}>
      <ControlledStakeForm
        assetSelector={
          <AssetSelect
            chains={chains}
            selectedChain={selectedChain}
            onSelectChain={chain => startTransition(() => setSelectedChain(chain))}
            inTransition={inTransition}
          />
        }
      />
    </ChainProvider>
  )
}

export default StakeForm
