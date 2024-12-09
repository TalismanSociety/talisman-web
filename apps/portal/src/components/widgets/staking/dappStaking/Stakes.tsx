import { formatDistance } from 'date-fns'
import { useState, useTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

import StakePosition, { StakePositionErrorBoundary } from '@/components/recipes/StakePosition'

import type { Account } from '../../../../domains/accounts'
import { selectedSubstrateAccountsState } from '../../../../domains/accounts'
import { ChainProvider, dappStakingEnabledChainsState, useChainState } from '../../../../domains/chains'
import { useExtrinsic, useNativeTokenLocalizedFiatAmount } from '../../../../domains/common'
import {
  useClaimAllRewardsExtrinsic,
  useRegisteredDappsState,
  useStakeLoadable,
  useTotalDappStakingRewards,
} from '../../../../domains/staking/dappStaking'
import DappStakingLockedAmountDialog from '../../../recipes/DappStakingLockedAmountDialog'
import ErrorBoundary from '../../ErrorBoundary'
import useUnlockDuration from '../providers/hooks/dapp/useUnlockDuration'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

const TotalRewards = (props: { account: Account }) => useTotalDappStakingRewards(props.account).toLocaleString()

const TotalFiatRewards = (props: { account: Account }) =>
  useNativeTokenLocalizedFiatAmount(useTotalDappStakingRewards(props.account))

const Stake = ({
  account,
  setShouldRenderLoadingSkeleton,
}: {
  account: Account
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [addStakeDialogOpen, setAddStakeDialogOpen] = useState(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState(false)
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false)

  // Pre-load potentially heavy query
  useRecoilValueLoadable(useRegisteredDappsState())

  const navigate = useNavigate()

  const chain = useRecoilValue(useChainState())
  const { data: stake, isLoading } = useStakeLoadable(account)

  const claimAllRewardsExtrinsic = useClaimAllRewardsExtrinsic(stake)
  const withdrawExtrinsic = useExtrinsic('dappStaking', 'withdrawUnbonded')
  const unlockExtrinsic = useExtrinsic('dappStaking', 'unlock')

  const [requestReStakeInTransition, startRequestRestakeTransition] = useTransition()
  const unlockDuration = formatDistance(0, useUnlockDuration())

  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}

  if (stake.active || !isLoading) {
    setShouldRenderLoadingSkeleton(false)
  }

  if (!stake.active) {
    return null
  }

  return (
    <>
      <StakePosition
        readonly={account.readonly}
        chain={name}
        chainId={chain.id}
        assetSymbol={symbol}
        assetLogoSrc={logo}
        account={account}
        provider="DApp staking"
        stakeStatus={stake.earningRewards ? 'earning_rewards' : 'not_earning_rewards'}
        balance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            {stake.totalStaked?.decimalAmount?.toLocaleString()}
          </ErrorBoundary>
        }
        fiatBalance={
          <ErrorBoundary renderFallback={() => <>--</>}>{stake.totalStaked?.localizedFiatAmount}</ErrorBoundary>
        }
        rewards={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <TotalRewards account={account} />
          </ErrorBoundary>
        }
        fiatRewards={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <TotalFiatRewards account={account} />
          </ErrorBoundary>
        }
        increaseStakeButton={
          stake.dapps.length > 0 && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.IncreaseStakeButton onClick={() => setAddStakeDialogOpen(true)} withTransition />
            </ErrorBoundary>
          )
        }
        unstakeButton={
          stake.dapps.length > 0 && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.UnstakeButton onClick={() => setUnstakeDialogOpen(true)} withTransition />
            </ErrorBoundary>
          )
        }
        lockedButton={
          (stake.locked?.decimalAmount.planck ?? 0n) > 0n && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.LockedButton
                loading={unlockExtrinsic.state === 'loading'}
                amount={stake.locked?.decimalAmount.toLocaleString()}
                onClick={() => setLockedDialogOpen(true)}
              />
            </ErrorBoundary>
          )
        }
        claimButton={
          (stake.totalRewards?.decimalAmount.planck ?? 0n) > 0n && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.ClaimButton
                loading={claimAllRewardsExtrinsic.state === 'loading'}
                amount={stake.totalRewards?.decimalAmount.toLocaleString()}
                onClick={() => {
                  void claimAllRewardsExtrinsic.signAndSend(account.address)
                }}
              />
            </ErrorBoundary>
          )
        }
        withdrawButton={
          (stake.withdrawable?.decimalAmount.planck ?? 0n) > 0n && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.WithdrawButton
                loading={withdrawExtrinsic.state === 'loading'}
                amount={stake.withdrawable?.decimalAmount.toLocaleString()}
                onClick={() => {
                  void withdrawExtrinsic.signAndSend(account.address)
                }}
              />
            </ErrorBoundary>
          )
        }
        unstakingStatus={
          stake.unlocking.length > 0 && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.UnstakingStatus
                amount={stake.totalUnlocking?.decimalAmount.toLocaleString()}
                unlocks={stake.unlocking.map(x => ({ amount: x.amount.decimalAmount.toLocaleString(), eta: x.eta }))}
              />
            </ErrorBoundary>
          )
        }
      />
      {addStakeDialogOpen && (
        <AddStakeDialog account={account} stake={stake} onRequestDismiss={() => setAddStakeDialogOpen(false)} />
      )}
      {unstakeDialogOpen && (
        <UnstakeDialog account={account} stake={stake} onRequestDismiss={() => setUnstakeDialogOpen(false)} />
      )}
      {lockedDialogOpen && (
        <DappStakingLockedAmountDialog
          amount={stake.locked?.decimalAmount.toLocaleString()}
          fiatAmount={stake.locked?.localizedFiatAmount}
          unlockDuration={unlockDuration}
          onRequestDismiss={() => setLockedDialogOpen(false)}
          onRequestReStake={() => {
            startRequestRestakeTransition(() => {
              if (stake.dapps.length > 0) {
                setAddStakeDialogOpen(true)
              } else {
                navigate(`?action=stake&type=dapp-staking&chain=${chain.id}&account=${account.address}`)
              }
              setLockedDialogOpen(false)
            })
          }}
          requestReStakeInTransition={requestReStakeInTransition}
          onRequestUnlock={() => {
            void unlockExtrinsic.signAndSend(account.address, stake.locked?.decimalAmount.planck ?? 0n)
            setLockedDialogOpen(false)
          }}
        />
      )}
    </>
  )
}

type StakesProps = {
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

const Stakes = ({ setShouldRenderLoadingSkeleton }: StakesProps) => {
  const chainsLoadable = useRecoilValueLoadable(dappStakingEnabledChainsState)

  const accountsLoadable = useRecoilValueLoadable(selectedSubstrateAccountsState)

  const accounts = accountsLoadable.valueMaybe()
  const chains = chainsLoadable.valueMaybe()

  return (
    <>
      {chains?.map((chain, index) => (
        <ChainProvider key={index} chain={chain}>
          {accounts?.map((account, index) => {
            const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}
            return (
              <ErrorBoundary
                key={index}
                renderFallback={() => (
                  <StakePositionErrorBoundary
                    chain={name}
                    assetSymbol={symbol}
                    assetLogoSrc={logo}
                    account={account}
                    provider="DApp staking"
                    key={index}
                  />
                )}
              >
                <Stake account={account} setShouldRenderLoadingSkeleton={setShouldRenderLoadingSkeleton} />
              </ErrorBoundary>
            )
          })}
        </ChainProvider>
      ))}
    </>
  )
}

export default Stakes
