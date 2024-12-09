import { useCallback, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import type { usePoolStakes } from '@/domains/staking/substrate/nominationPools'
import StakePosition from '@/components/recipes/StakePosition'
import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { RedactableBalance } from '@/components/widgets/RedactableBalance'
import { type Account } from '@/domains/accounts'
import { useChainState, useNativeTokenDecimalState, useNativeTokenPriceState } from '@/domains/chains'
import {
  useEraEtaFormatter,
  useExtrinsic,
  useNativeTokenLocalizedFiatAmount,
  useSubmittableResultLoadableState,
} from '@/domains/common'
import { useTotalNominationPoolRewards } from '@/domains/staking/substrate/nominationPools'

import AddStakeDialog from './AddStakeDialog'
import ClaimStakeDialog from './ClaimStakeDialog'
import NominationPoolsStatisticsSideSheet from './NominationPoolsStatisticsSideSheet'
import PoolClaimPermissionDialog from './PoolClaimPermissionDialog'
import UnstakeDialog from './UnstakeDialog'

const PoolTotalRewards = (props: { account: Account }) => {
  const total = useTotalNominationPoolRewards(props.account)
  return total?.toLocaleString() ?? undefined
}

const PoolTotalFiatRewards = (props: { account: Account }) => {
  const total = useTotalNominationPoolRewards(props.account)
  const totalLocalisedFiat = useNativeTokenLocalizedFiatAmount(total)
  return totalLocalisedFiat ?? undefined
}

const PoolStakeItem = ({ item }: { item: ReturnType<typeof usePoolStakes<Account[]>>[number] }) => {
  const [chain, decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([useChainState(), useNativeTokenDecimalState(), useNativeTokenPriceState()])
  )

  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isAddingStake, setIsAddingStake] = useState(false)

  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const [claimPayoutLoadable, setClaimPayoutLoadable] = useSubmittableResultLoadableState()
  const [restakeLoadable, setRestakeLoadable] = useSubmittableResultLoadableState()

  const withdrawExtrinsic = useExtrinsic('nominationPools', 'withdrawUnbonded')

  const eraEtaFormatter = useEraEtaFormatter()
  const unlocks = item.unlockings?.map(x => ({
    amount: <RedactableBalance>{decimal.fromPlanck(x.amount).toLocaleString()}</RedactableBalance>,
    eta: eraEtaFormatter(x.erasTilWithdrawable),
  }))

  const [statsDialogOpen, setStatsDialogOpen] = useState(false)

  const [claimPermissionDialogOpen, setClaimPermissionDialogOpen] = useState(false)

  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}

  return (
    <>
      <StakePosition
        chain={name}
        chainId={chain?.id ?? ''}
        assetSymbol={symbol}
        assetLogoSrc={logo}
        readonly={item.account.readonly}
        stakeStatus={item.status}
        account={item.account}
        balance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <RedactableBalance>
              {decimal.fromPlanckOrUndefined(item.poolMember.points.toBigInt())?.toLocaleString()}
            </RedactableBalance>
          </ErrorBoundary>
        }
        fiatBalance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <AnimatedFiatNumber
              end={
                (decimal.fromPlanckOrUndefined(item.poolMember.points.toBigInt())?.toNumber() ?? 0) * nativeTokenPrice
              }
            />
          </ErrorBoundary>
        }
        rewards={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <PoolTotalRewards account={item.account} />
          </ErrorBoundary>
        }
        fiatRewards={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <PoolTotalFiatRewards account={item.account} />
          </ErrorBoundary>
        }
        provider={item.poolName ?? ''}
        shortProvider="Nomination pool"
        claimButton={
          item.pendingRewards?.isZero() === false && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.ClaimButton
                amount={
                  <RedactableBalance>
                    {decimal.fromPlanck(item.pendingRewards.toBigInt()).toLocaleString()}
                  </RedactableBalance>
                }
                onClick={() => setClaimDialogOpen(true)}
                loading={claimPayoutLoadable.state === 'loading' || restakeLoadable.state === 'loading'}
              />
            </ErrorBoundary>
          )
        }
        unstakeButton={
          // Fully unbonding pool can't be interacted with
          !item.poolMember.points.isZero() && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.UnstakeButton onClick={() => setIsUnstaking(true)} />
            </ErrorBoundary>
          )
        }
        increaseStakeButton={
          // Fully unbonding pool can't be interacted with
          !item.poolMember.points.isZero() && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.IncreaseStakeButton onClick={() => setIsAddingStake(true)} />
            </ErrorBoundary>
          )
        }
        withdrawButton={
          item.withdrawable > 0n && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.WithdrawButton
                amount={<RedactableBalance>{decimal.fromPlanck(item.withdrawable).toLocaleString()}</RedactableBalance>}
                onClick={() => {
                  void withdrawExtrinsic.signAndSend(
                    item.account?.address ?? '',
                    item.account?.address ?? '',
                    item.slashingSpan
                  )
                }}
                loading={withdrawExtrinsic.state === 'loading'}
              />
            </ErrorBoundary>
          )
        }
        menuButton={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <StakePosition.MenuButton>
              <StakePosition.MenuButton.Item.Button
                headlineContent="Statistics"
                onClick={() => setStatsDialogOpen(true)}
                withTransition
              />
              {!item.account.readonly && (
                <StakePosition.MenuButton.Item.Button
                  headlineContent="Claim settings"
                  onClick={() => setClaimPermissionDialogOpen(true)}
                />
              )}
            </StakePosition.MenuButton>
          </ErrorBoundary>
        }
        unstakingStatus={
          item.totalUnlocking > 0n && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.UnstakingStatus
                amount={
                  <RedactableBalance>{decimal.fromPlanck(item.totalUnlocking).toLocaleString()}</RedactableBalance>
                }
                unlocks={unlocks ?? []}
              />
            </ErrorBoundary>
          )
        }
      />
      <AddStakeDialog
        account={isAddingStake ? item.account?.address : undefined}
        onDismiss={useCallback(() => setIsAddingStake(false), [])}
      />
      <UnstakeDialog
        account={isUnstaking ? item.account?.address : undefined}
        onDismiss={useCallback(() => setIsUnstaking(false), [])}
      />
      <ClaimStakeDialog
        open={claimDialogOpen}
        onRequestDismiss={() => setClaimDialogOpen(false)}
        account={item.account}
        onChangeClaimPayoutLoadable={setClaimPayoutLoadable}
        onChangeRestakeLoadable={setRestakeLoadable}
      />
      {statsDialogOpen && (
        <NominationPoolsStatisticsSideSheet account={item.account} onRequestDismiss={() => setStatsDialogOpen(false)} />
      )}
      {claimPermissionDialogOpen && (
        <PoolClaimPermissionDialog
          account={item.account}
          onRequestDismiss={() => setClaimPermissionDialogOpen(false)}
        />
      )}
    </>
  )
}

export default PoolStakeItem
