import { TalismanHandLoader } from '@components/TalismanHandLoader'
import StakeBannerComponent from '@components/recipes/StakeBanner/StakeBanner'
import { EmptyStakeDetails } from '@components/recipes/StakeDetails'
import StakeDetailsComponent from '@components/recipes/StakeDetails/StakeDetails'
import StakeDashboard from '@components/templates/StakeDashboard/StakeDashboard'
import { useAccountSelector } from '@components/widgets/AccountSelector'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import RedactableBalance from '@components/widgets/RedactableBalance'
import AddStakeDialog from '@components/widgets/staking/AddStakeDialog'
import ClaimStakeDialog from '@components/widgets/staking/ClaimStakeDialog'
import StakeCalculatorDialog from '@components/widgets/staking/StakeCalculatorDialog'
import { AssetSelect } from '@components/widgets/staking/StakeForm'
import UnstakeDialog from '@components/widgets/staking/UnstakeDialog'
import { substrateAccountsState, type Account } from '@domains/accounts'
import { injectedNominationPoolBalances, selectedCurrencyState } from '@domains/balances'
import { ChainContext, ChainProvider, chainsState, useNativeTokenDecimalState, type Chain } from '@domains/chains'
import {
  useEraEtaFormatter,
  useExtrinsic,
  useSubmittableResultLoadableState,
  useSubstrateApiState,
  useTokenAmountFromPlanck,
} from '@domains/common'
import {
  mostRecentPoolPayoutsState,
  poolPayoutsState,
  totalPoolPayoutsState,
  useInflation,
  usePoolStakes,
  type DerivedPool,
} from '@domains/nominationPools'
import { encodeAddress } from '@polkadot/util-crypto'
import { useQueryState } from '@talismn/react-polkadot-api'
import { subDays } from 'date-fns'
import { Suspense, useCallback, useContext, useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

const useOpenStakeModal = (account?: Account) => {
  const chain = useContext(ChainContext)
  const [_, setSearchParams] = useSearchParams()

  return useCallback(
    () =>
      setSearchParams(params => {
        params.set('action', 'stake')
        params.set('chain', chain.id)
        if (account !== undefined) {
          params.set('account', account.address)
        }

        return params
      }),
    [account, chain.id, setSearchParams]
  )
}

const StakeBanner = () => {
  const [balances, currency] = useRecoilValue(waitForAll([injectedNominationPoolBalances, selectedCurrencyState]))
  const [stakeCalculatorDialogOpen, setStakeCalculatorDialogOpen] = useState(false)

  return (
    <>
      <StakeBannerComponent
        balance={
          <AnimatedFiatNumber end={useMemo(() => balances.sum.fiat(currency).total, [balances.sum, currency])} />
        }
        onClickSimulateRewards={() => setStakeCalculatorDialogOpen(true)}
        onClickStake={useOpenStakeModal()}
      />
      {/* To reset the dialog state */}
      {stakeCalculatorDialogOpen && (
        <StakeCalculatorDialog
          open={stakeCalculatorDialogOpen}
          onRequestDismiss={() => setStakeCalculatorDialogOpen(false)}
        />
      )}
    </>
  )
}

const StakeDetailsActive = ({ account, pool }: { account: Account; pool: DerivedPool }) => {
  const chain = useContext(ChainContext)

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

  const [api, decimal, last15DaysPayouts, last15DaysTotalPayouts, mostRecentPayouts] = useRecoilValue(
    waitForAll([
      useSubstrateApiState(),
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
        balance={<RedactableBalance>{balance.decimalAmount.toHuman()}</RedactableBalance>}
        rewards={<RedactableBalance>{last15DaysTotalPayouts.toHuman()}</RedactableBalance>}
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
              displayAmount: <RedactableBalance>{x.amount.toHuman()}</RedactableBalance>,
            })),
          [last15DaysPayouts]
        )}
        mostRecentPayouts={useMemo(
          () =>
            mostRecentPayouts.map(x => ({
              date: x.date,
              amount: x.amount.toNumber(),
              displayAmount: <RedactableBalance>{x.amount.toHuman()}</RedactableBalance>,
            })),
          [mostRecentPayouts]
        )}
        subscanPayoutsUrl={useMemo(
          () =>
            new URL(
              `account/${encodeAddress(account.address, api.registry.chainSS58)}?tab=paidout`,
              chain.subscanUrl
            ).toString(),
          [account.address, api.registry.chainSS58, chain.subscanUrl]
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

const NoStake = (props: { account?: Account }) => {
  const minJoinBondLoadable = useRecoilValueLoadable(useQueryState('nominationPools', 'minJoinBond', []))
  const minJoinBond = useTokenAmountFromPlanck(minJoinBondLoadable.valueMaybe())

  const [stakeCalculatorDialogOpen, setStakeCalculatorDialogOpen] = useState(false)

  return (
    <>
      <EmptyStakeDetails
        minJoinBond={minJoinBond.decimalAmount?.toHuman()}
        onClickSimulateRewards={() => setStakeCalculatorDialogOpen(true)}
        onClickStake={useOpenStakeModal(props.account)}
      />
      {/* To reset the dialog state */}
      {stakeCalculatorDialogOpen && (
        <StakeCalculatorDialog
          open={stakeCalculatorDialogOpen}
          onRequestDismiss={() => setStakeCalculatorDialogOpen(false)}
        />
      )}
    </>
  )
}

const StakeDetails = (props: { account: Account }) => {
  const chain = useContext(ChainContext)
  const pool = usePoolStakes(props.account)

  if (pool === undefined) {
    return <NoStake account={props.account} />
  }

  return (
    <StakeDetailsActive
      // Force re-mount component & reset loading state on chain or account changes
      key={chain.genesisHash + props.account.address}
      account={props.account}
      pool={pool}
    />
  )
}

const Staking = () => {
  const [inTransition, startTransition] = useTransition()

  const chains = useRecoilValue(chainsState)
  const [chain, setChain] = useState<Chain>(chains[0])

  const accounts = useRecoilValue(substrateAccountsState)
  const [account, accountSelector] = useAccountSelector(accounts, 0)

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
      chainCount={chains.length}
      accountSelector={accountSelector}
      accountCount={accounts.length}
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
