import { TalismanHandLoader } from '@components/TalismanHandLoader'
import StakeBannerComponent from '@components/recipes/StakeBanner/StakeBanner'
import { EmptyStakeDetails } from '@components/recipes/StakeDetails'
import StakeDetailsComponent from '@components/recipes/StakeDetails/StakeDetails'
import StakeDashboard from '@components/templates/StakeDashboard/StakeDashboard'
import { useAccountSelector } from '@components/widgets/AccountSelector'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import AddStakeDialog from '@components/widgets/staking/AddStakeDialog'
import ClaimStakeDialog from '@components/widgets/staking/ClaimStakeDialog'
import StakeCalculatorDialog from '@components/widgets/staking/StakeCalculatorDialog'
import { AssetSelect } from '@components/widgets/staking/StakeForm'
import UnstakeDialog from '@components/widgets/staking/UnstakeDialog'
import { substrateAccountsState, type Account } from '@domains/accounts'
import { injectedBalancesState } from '@domains/balances/recoils'
import { ChainContext, ChainProvider, chainsState, useNativeTokenDecimalState, type Chain } from '@domains/chains'
import {
  useEraEtaFormatter,
  useExtrinsic,
  useSubmittableResultLoadableState,
  useTokenAmountFromPlanck,
} from '@domains/common'
import {
  poolPayoutsState,
  useInflation,
  usePoolStakes,
  type DerivedPool,
  totalPoolPayoutsState,
  mostRecentPoolPayoutsState,
} from '@domains/nominationPools'
import { useQueryState } from '@talismn/react-polkadot-api'
import { subDays } from 'date-fns'
import { Suspense, useCallback, useContext, useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

const useOpenStakeModal = () => {
  const chain = useContext(ChainContext)
  const [_, setSearchParams] = useSearchParams()

  return useCallback(
    () =>
      setSearchParams(params => {
        params.set('action', 'stake')
        params.set('chain', chain.id)
        return params
      }),
    [chain.id, setSearchParams]
  )
}

const StakeBanner = () => {
  const balances = useRecoilValue(injectedBalancesState)
  const [stakeCalculatorDialogOpen, setStakeCalculatorDialogOpen] = useState(false)

  return (
    <>
      <StakeBannerComponent
        balance={useMemo(
          () =>
            balances
              .find(
                balance => balance.source === 'substrate-native' && balance.toJSON().subSource === 'nompools-staking'
              )
              .sum.fiat('usd')
              .total.toLocaleString(undefined, {
                style: 'currency',
                currency: 'usd',
                currencyDisplay: 'narrowSymbol',
              }),
          [balances]
        )}
        onClickSimulateRewards={() => setStakeCalculatorDialogOpen(true)}
        onClickStake={useOpenStakeModal()}
      />
      <StakeCalculatorDialog
        open={stakeCalculatorDialogOpen}
        onRequestDismiss={() => setStakeCalculatorDialogOpen(false)}
      />
    </>
  )
}

const StakeDetailsActive = ({ account, pool }: { account: Account; pool: DerivedPool }) => {
  const { stakedReturn } = useInflation()

  const balance = useTokenAmountFromPlanck(pool.poolMember.points)
  const rewards = useTokenAmountFromPlanck(pool.pendingRewards)
  const withdrawable = useTokenAmountFromPlanck(pool.withdrawable)

  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const [claimPayoutLoadable, setClaimPayoutLoadable] = useSubmittableResultLoadableState()
  const [restakeLoadable, setRestakeLoadable] = useSubmittableResultLoadableState()

  const withdrawExtrinsic = useExtrinsic('nominationPools', 'withdrawUnbonded', [account.address, pool.slashingSpan])

  const [addStakeDialogOpen, setAddStakeDialogOpen] = useState(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState(false)

  const today = useMemo(() => new Date(), [])

  const payoutsStateParams = {
    account: account.address,
    poolId: pool.poolMember.poolId.toNumber(),
    chain: useContext(ChainContext),
    fromDate: subDays(today, 15),
    toDate: today,
  }

  const [decimal, last15DaysPayouts, last15DaysTotalPayouts, mostRecentPayouts] = useRecoilValue(
    waitForAll([
      useNativeTokenDecimalState(),
      poolPayoutsState(payoutsStateParams),
      totalPoolPayoutsState(payoutsStateParams),
      mostRecentPoolPayoutsState(payoutsStateParams),
    ])
  )

  const eraEtaFormatter = useEraEtaFormatter()

  return (
    <>
      <StakeDetailsComponent
        account={account}
        poolName={pool.poolName}
        poolStatus={pool.status}
        claimButton={
          rewards.decimalAmount?.planck.isZero() === false && (
            <StakeDetailsComponent.ClaimButton
              amount={rewards.decimalAmount?.toHuman()}
              onClick={() => setClaimDialogOpen(true)}
              loading={claimPayoutLoadable.state === 'loading' || restakeLoadable.state === 'loading'}
            />
          )
        }
        withdrawButton={
          !withdrawable.decimalAmount.planck.isZero() && (
            <StakeDetailsComponent.WithdrawButton
              amount={withdrawable.decimalAmount.toHuman()}
              onClick={() => {
                void withdrawExtrinsic.signAndSend(account.address)
              }}
              loading={withdrawExtrinsic.state === 'loading'}
            />
          )
        }
        addButton={
          // Fully unbonding pool can't be interacted with
          !pool.poolMember.points.isZero() && (
            <StakeDetailsComponent.AddButton onClick={() => setAddStakeDialogOpen(true)} />
          )
        }
        unbondButton={
          // Fully unbonding pool can't be interacted with
          !pool.poolMember.points.isZero() && (
            <StakeDetailsComponent.UnbondButton onClick={() => setUnstakeDialogOpen(true)} />
          )
        }
        balance={balance.decimalAmount.toHuman()}
        rewards={last15DaysTotalPayouts.toHuman()}
        apr={stakedReturn.toLocaleString(undefined, { style: 'percent' })}
        nextEraEta={useEraEtaFormatter()(1)}
        unbondings={useMemo(
          () =>
            pool.unlockings.map(x => ({
              eta: eraEtaFormatter(x.erasTilWithdrawable),
              amount: decimal.fromPlanck(x.amount).toHuman(),
            })),
          [decimal, eraEtaFormatter, pool.unlockings]
        )}
        last15DaysPayouts={useMemo(
          () =>
            last15DaysPayouts.map(x => ({
              date: x.date,
              amount: x.amount.toNumber(),
              displayAmount: x.amount.toHuman(),
            })),
          [last15DaysPayouts]
        )}
        mostRecentPayouts={useMemo(
          () =>
            mostRecentPayouts.map(x => ({
              date: x.date,
              amount: x.amount.toNumber(),
              displayAmount: x.amount.toHuman(),
            })),
          [mostRecentPayouts]
        )}
        readonly={account.readonly}
      />
      <ClaimStakeDialog
        open={claimDialogOpen}
        onRequestDismiss={() => setClaimDialogOpen(false)}
        account={account}
        onChangeClaimPayoutLoadable={setClaimPayoutLoadable}
        onChangeRestakeLoadable={setRestakeLoadable}
      />
      <AddStakeDialog
        account={addStakeDialogOpen ? account.address : undefined}
        onDismiss={() => setAddStakeDialogOpen(false)}
      />
      <UnstakeDialog
        account={unstakeDialogOpen ? account.address : undefined}
        onDismiss={() => setUnstakeDialogOpen(false)}
      />
    </>
  )
}

const NoStake = () => {
  const minJoinBondLoadable = useRecoilValueLoadable(useQueryState('nominationPools', 'minJoinBond', []))
  const minJoinBond = useTokenAmountFromPlanck(minJoinBondLoadable.valueMaybe())

  const [stakeCalculatorDialogOpen, setStakeCalculatorDialogOpen] = useState(false)

  return (
    <>
      <EmptyStakeDetails
        minJoinBond={minJoinBond.decimalAmount?.toHuman()}
        onClickSimulateRewards={() => setStakeCalculatorDialogOpen(true)}
        onClickStake={useOpenStakeModal()}
      />
      <StakeCalculatorDialog
        open={stakeCalculatorDialogOpen}
        onRequestDismiss={() => setStakeCalculatorDialogOpen(false)}
      />
    </>
  )
}

const StakeDetails = (props: { account: Account }) => {
  const pool = usePoolStakes(props.account)

  if (pool === undefined) {
    return <NoStake />
  }

  return <StakeDetailsActive account={props.account} pool={pool} />
}

const Staking = () => {
  const [inTransition, startTransition] = useTransition()

  const chains = useRecoilValue(chainsState)
  const [chain, setChain] = useState<Chain>(chains[0])

  const [account, accountSelector] = useAccountSelector(useRecoilValue(substrateAccountsState), 0)

  return (
    <StakeDashboard
      banner={<StakeBanner />}
      chainSelector={
        <AssetSelect
          iconSize="4rem"
          chains={chains}
          selectedChain={chain}
          onSelectChain={chain => startTransition(() => setChain(chain))}
          inTransition={inTransition}
        />
      }
      accountSelector={accountSelector}
      details={
        chain === undefined || account === undefined ? undefined : (
          <ErrorBoundary>
            <ChainProvider chain={chain}>
              <Suspense
                fallback={
                  <div css={{ display: 'flex', height: '100%' }}>
                    <TalismanHandLoader css={{ margin: 'auto' }} />
                  </div>
                }
              >
                <StakeDetails account={account} />
              </Suspense>
            </ChainProvider>
          </ErrorBoundary>
        )
      }
    />
  )
}

export default Staking
