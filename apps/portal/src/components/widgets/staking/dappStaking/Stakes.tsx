import { selectedSubstrateAccountsState, type Account } from '../../../../domains/accounts'
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
import AddStakeDialog from './AddStakeDialog'
import UnlockDuration from './UnlockDuration'
import UnstakeDialog from './UnstakeDialog'
import { StakePosition } from '@talismn/ui-recipes'
import { StakePositionErrorBoundary } from '@talismn/ui-recipes'
import { useState, useTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

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
        assetSymbol={symbol}
        assetLogoSrc={logo}
        account={account}
        provider="DApp staking"
        stakeStatus={stake.earningRewards ? 'earning_rewards' : 'not_earning_rewards'}
        balance={stake.totalStaked?.decimalAmount?.toLocaleString()}
        fiatBalance={stake.totalStaked?.localizedFiatAmount}
        rewards={<TotalRewards account={account} />}
        fiatRewards={<TotalFiatRewards account={account} />}
        increaseStakeButton={
          stake.dapps.length > 0 && (
            <StakePosition.IncreaseStakeButton onClick={() => setAddStakeDialogOpen(true)} withTransition />
          )
        }
        unstakeButton={
          stake.dapps.length > 0 && (
            <StakePosition.UnstakeButton onClick={() => setUnstakeDialogOpen(true)} withTransition />
          )
        }
        lockedButton={
          stake.locked?.decimalAmount.planck !== 0n && (
            <StakePosition.LockedButton
              loading={unlockExtrinsic.state === 'loading'}
              amount={stake.locked?.decimalAmount.toLocaleString()}
              onClick={() => setLockedDialogOpen(true)}
            />
          )
        }
        claimButton={
          stake.totalRewards?.decimalAmount.planck !== 0n && (
            <StakePosition.ClaimButton
              loading={claimAllRewardsExtrinsic.state === 'loading'}
              amount={stake.totalRewards?.decimalAmount.toLocaleString()}
              onClick={() => {
                void claimAllRewardsExtrinsic.signAndSend(account.address)
              }}
            />
          )
        }
        withdrawButton={
          (stake.withdrawable?.decimalAmount.planck ?? 0n) > 0n && (
            <StakePosition.WithdrawButton
              loading={withdrawExtrinsic.state === 'loading'}
              amount={stake.withdrawable?.decimalAmount.toLocaleString()}
              onClick={() => {
                void withdrawExtrinsic.signAndSend(account.address)
              }}
            />
          )
        }
        unstakingStatus={
          stake.unlocking.length > 0 && (
            <StakePosition.UnstakingStatus
              amount={stake.totalUnlocking?.decimalAmount.toLocaleString()}
              unlocks={stake.unlocking.map(x => ({ amount: x.amount.decimalAmount.toLocaleString(), eta: x.eta }))}
            />
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
          unlockDuration={<UnlockDuration />}
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
