import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

import SeekLogo from '@/assets/seek.svg'
import { StakePosition, StakePositionErrorBoundary } from '@/components/recipes/StakePosition'
import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { RedactableBalance } from '@/components/widgets/RedactableBalance'
import { Account, evmSignableAccountsState } from '@/domains/accounts/recoils'
import { CHAIN_ID, CHAIN_NAME, SEEK_TICKER } from '@/domains/staking/seek/constants'
import { Decimal } from '@/util/Decimal'

import useCancelWithdrawalSeek from '../hooks/seek/useCancelWithdrawalSeek'
import useClaimEarnedSeek from '../hooks/seek/useClaimEarnedSeek'
import useCompleteWithdrawalSeek from '../hooks/seek/useCompleteWithdrawalSeek'
import useGetSeekStaked from '../hooks/seek/useGetSeekStaked'
import SeekAddStakeDialog from './SeekAddStakeDialog'
import SeekUnstakeDialog from './SeekUnstakeDialog'

type StakesProps = {
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

type SeekStakePositionProps = StakesProps & {
  account: Account
}

const SeekStakes = ({ setShouldRenderLoadingSkeleton }: StakesProps) => {
  const evmSignableAccounts = useRecoilValue(evmSignableAccountsState)

  return evmSignableAccounts.map((account, index) => (
    <SeekStakePosition key={index} account={account} setShouldRenderLoadingSkeleton={setShouldRenderLoadingSkeleton} />
  ))
}

const SeekStakePosition = ({ account, setShouldRenderLoadingSkeleton }: SeekStakePositionProps) => {
  const [increaseStakeDialogOpen, setIncreaseStakeDialogOpen] = useState<boolean>(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState<boolean>(false)

  const {
    data: { balances },
  } = useGetSeekStaked()

  const { earnedBalance, isReady, getReward, getRewardTransaction } = useClaimEarnedSeek({ account })
  const {
    pendingWithdrawalsBalance,
    etaString,
    completeWithdrawal,
    completeWithdrawalTransaction,
    isReady: isCompleteWithdrawalReady,
  } = useCompleteWithdrawalSeek({ account })
  const { cancelWithdrawal } = useCancelWithdrawalSeek({ account })

  const stakedBalance = balances.find(balance => balance.address === account.address)

  const shouldDisplayAssetRow = useMemo(() => {
    return stakedBalance?.amount || earnedBalance.planck > 0n || pendingWithdrawalsBalance.planck > 0n
  }, [earnedBalance.planck, pendingWithdrawalsBalance.planck, stakedBalance?.amount])

  if (!shouldDisplayAssetRow) return null

  setShouldRenderLoadingSkeleton(false)

  const { amountDecimal } = stakedBalance ?? { amountDecimal: Decimal.fromPlanck(0n, 0) }
  // TODO: fetch SEEK fiat price
  const fiatBalance = 0

  return (
    <ErrorBoundary
      orientation="horizontal"
      renderFallback={() => (
        <StakePositionErrorBoundary
          chain={CHAIN_NAME}
          assetSymbol={SEEK_TICKER}
          assetLogoSrc={SeekLogo}
          account={account}
          provider="Talisman"
        />
      )}
    >
      <StakePosition
        readonly={!account.canSignEvm}
        errorMessage={pendingWithdrawalsBalance.planck > 0n ? 'Unstake in progress' : undefined}
        isError={pendingWithdrawalsBalance.planck > 0n}
        account={account}
        provider="Talisman"
        stakeStatus={amountDecimal.planck > 0n ? 'earning_rewards' : 'not_earning_rewards'}
        balance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <RedactableBalance>{amountDecimal.toLocaleString()}</RedactableBalance>
          </ErrorBoundary>
        }
        fiatBalance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <AnimatedFiatNumber end={fiatBalance} />
          </ErrorBoundary>
        }
        chain={CHAIN_NAME}
        chainId={CHAIN_ID}
        assetSymbol={SEEK_TICKER}
        assetLogoSrc={SeekLogo}
        increaseStakeButton={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <StakePosition.IncreaseStakeButton onClick={() => setIncreaseStakeDialogOpen(true)} />
          </ErrorBoundary>
        }
        unstakeButton={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <StakePosition.UnstakeButton onClick={() => setUnstakeDialogOpen(true)} />
          </ErrorBoundary>
        }
        cancelUnstakeButton={
          pendingWithdrawalsBalance.planck > 0n && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.CancelUnstakeButton onClick={() => cancelWithdrawal.writeContractAsync()} />
            </ErrorBoundary>
          )
        }
        claimButton={
          earnedBalance.planck > 0n && (
            <StakePosition.ClaimButton
              amount={earnedBalance.toLocaleString()}
              onClick={() => getReward.writeContractAsync()}
              loading={getRewardTransaction.isLoading || getReward.isPending || !isReady}
            />
          )
        }
        unstakingStatus={
          pendingWithdrawalsBalance.planck > 0n && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.UnstakingStatus
                amount={pendingWithdrawalsBalance.toLocaleString()}
                unlocks={[{ amount: pendingWithdrawalsBalance.toLocaleString(), eta: etaString }]}
              />
            </ErrorBoundary>
          )
        }
        withdrawButton={
          pendingWithdrawalsBalance.planck > 0n &&
          isCompleteWithdrawalReady && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.WithdrawButton
                amount={pendingWithdrawalsBalance.toLocaleString()}
                onClick={() => completeWithdrawal.writeContractAsync()}
                loading={completeWithdrawalTransaction.isLoading || completeWithdrawal.isPending}
              />
            </ErrorBoundary>
          )
        }
      />
      {increaseStakeDialogOpen && (
        <SeekAddStakeDialog account={account} onRequestDismiss={() => setIncreaseStakeDialogOpen(false)} />
      )}
      {unstakeDialogOpen && (
        <SeekUnstakeDialog account={account} onRequestDismiss={() => setUnstakeDialogOpen(false)} />
      )}
    </ErrorBoundary>
  )
}

export default SeekStakes
