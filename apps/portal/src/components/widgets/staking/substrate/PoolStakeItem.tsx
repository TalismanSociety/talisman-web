import { type Account } from '../../../../domains/accounts'
import { useChainState, useNativeTokenDecimalState, useNativeTokenPriceState } from '../../../../domains/chains'
import {
  useEraEtaFormatter,
  useExtrinsic,
  useNativeTokenLocalizedFiatAmount,
  useSubmittableResultLoadableState,
} from '../../../../domains/common'
import {
  useTotalNominationPoolRewards,
  type usePoolStakes,
} from '../../../../domains/staking/substrate/nominationPools'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import RedactableBalance from '../../RedactableBalance'
import AddStakeDialog from './AddStakeDialog'
import ClaimStakeDialog from './ClaimStakeDialog'
import NominationPoolsStatisticsSideSheet from './NominationPoolsStatisticsSideSheet'
import PoolClaimPermissionDialog from './PoolClaimPermissionDialog'
import UnstakeDialog from './UnstakeDialog'
import StakePosition from '@/components/recipes/StakePosition'
import { useCallback, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

const PoolTotalRewards = (props: { account: Account }) => useTotalNominationPoolRewards(props.account).toLocaleString()

const PoolTotalFiatRewards = (props: { account: Account }) =>
  useNativeTokenLocalizedFiatAmount(useTotalNominationPoolRewards(props.account))

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
          <RedactableBalance>
            {decimal.fromPlanckOrUndefined(item.poolMember.points.toBigInt())?.toLocaleString()}
          </RedactableBalance>
        }
        fiatBalance={
          <AnimatedFiatNumber
            end={(decimal.fromPlanckOrUndefined(item.poolMember.points.toBigInt())?.toNumber() ?? 0) * nativeTokenPrice}
          />
        }
        rewards={<PoolTotalRewards account={item.account} />}
        fiatRewards={<PoolTotalFiatRewards account={item.account} />}
        provider={item.poolName ?? ''}
        shortProvider="Nomination pool"
        claimButton={
          item.pendingRewards?.isZero() === false && (
            <StakePosition.ClaimButton
              amount={
                <RedactableBalance>
                  {decimal.fromPlanck(item.pendingRewards.toBigInt()).toLocaleString()}
                </RedactableBalance>
              }
              onClick={() => setClaimDialogOpen(true)}
              loading={claimPayoutLoadable.state === 'loading' || restakeLoadable.state === 'loading'}
            />
          )
        }
        unstakeButton={
          // Fully unbonding pool can't be interacted with
          !item.poolMember.points.isZero() && <StakePosition.UnstakeButton onClick={() => setIsUnstaking(true)} />
        }
        increaseStakeButton={
          // Fully unbonding pool can't be interacted with
          !item.poolMember.points.isZero() && (
            <StakePosition.IncreaseStakeButton onClick={() => setIsAddingStake(true)} />
          )
        }
        withdrawButton={
          item.withdrawable > 0n && (
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
          )
        }
        menuButton={
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
        }
        unstakingStatus={
          item.totalUnlocking > 0n && (
            <StakePosition.UnstakingStatus
              amount={<RedactableBalance>{decimal.fromPlanck(item.totalUnlocking).toLocaleString()}</RedactableBalance>}
              unlocks={unlocks ?? []}
            />
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
