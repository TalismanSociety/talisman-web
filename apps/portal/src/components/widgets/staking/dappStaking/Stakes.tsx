import DappStakingLockedAmountDialog from '../../../recipes/DappStakingLockedAmountDialog'
import StakePosition from '../../../recipes/StakePosition'
import ErrorBoundary from '../../ErrorBoundary'
import { selectedSubstrateAccountsState, type Account } from '../../../../domains/accounts'
import { ChainProvider, dappStakingEnabledChainsState, useChainState } from '../../../../domains/chains'
import { useExtrinsic } from '../../../../domains/common'
import { useClaimAllRewardsExtrinsic, useRegisteredDappsState, useStake } from '../../../../domains/staking/dappStaking'
import { useState, useTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import AddStakeDialog from './AddStakeDialog'
import UnlockDuration from './UnlockDuration'
import UnstakeDialog from './UnstakeDialog'

const Stake = ({ account }: { account: Account }) => {
  // Pre-load potentially heavy query
  useRecoilValueLoadable(useRegisteredDappsState())

  const navigate = useNavigate()

  const chain = useRecoilValue(useChainState())
  const stake = useStake(account)

  const claimAllRewardsExtrinsic = useClaimAllRewardsExtrinsic(stake)
  const withdrawExtrinsic = useExtrinsic('dappStaking', 'withdrawUnbonded')
  const unlockExtrinsic = useExtrinsic('dappStaking', 'unlock')

  const [addStakeDialogOpen, _setAddStakeDialogOpen] = useState(false)
  const [addStakeDialogInTransition, startAddStakeDialogTransition] = useTransition()
  const setAddStakeDialogOpen = (value: boolean) => startAddStakeDialogTransition(() => _setAddStakeDialogOpen(value))

  const [unstakeDialogOpen, _setUnstakeDialogOpen] = useState(false)
  const [unstakeDialogInTransition, startUnstakeDialogTransition] = useTransition()
  const setUnstakeDialogOpen = (value: boolean) => startUnstakeDialogTransition(() => _setUnstakeDialogOpen(value))

  const [lockedDialogOpen, setLockedDialogOpen] = useState(false)
  const [requestReStakeInTransition, startRequestRestakeTransition] = useTransition()

  if (!stake.active) {
    return null
  }

  return (
    <>
      <StakePosition
        readonly={account.readonly}
        chain={chain.name}
        symbol={chain.nativeToken?.symbol ?? ''}
        account={account}
        provider="DApp staking"
        stakeStatus={stake.earningRewards ? 'earning_rewards' : 'not_earning_rewards'}
        balance={stake.totalStaked.decimalAmount?.toLocaleString()}
        fiatBalance={stake.totalStaked.localizedFiatAmount}
        increaseStakeButton={
          stake.dapps.length > 0 && (
            <StakePosition.IncreaseStakeButton
              loading={addStakeDialogInTransition}
              onClick={() => setAddStakeDialogOpen(true)}
            />
          )
        }
        unstakeButton={
          stake.dapps.length > 0 && (
            <StakePosition.UnstakeButton
              loading={unstakeDialogInTransition}
              onClick={() => setUnstakeDialogOpen(true)}
            />
          )
        }
        lockedButton={
          stake.locked.decimalAmount.planck !== 0n && (
            <StakePosition.LockedButton
              loading={unlockExtrinsic.state === 'loading'}
              amount={stake.locked.decimalAmount.toLocaleString()}
              onClick={() => setLockedDialogOpen(true)}
            />
          )
        }
        claimButton={
          stake.totalRewards.decimalAmount.planck !== 0n && (
            <StakePosition.ClaimButton
              loading={claimAllRewardsExtrinsic.state === 'loading'}
              amount={stake.totalRewards.decimalAmount.toLocaleString()}
              onClick={() => {
                void claimAllRewardsExtrinsic.signAndSend(account.address)
              }}
            />
          )
        }
        withdrawButton={
          stake.withdrawable.decimalAmount.planck > 0n && (
            <StakePosition.WithdrawButton
              loading={withdrawExtrinsic.state === 'loading'}
              amount={stake.withdrawable.decimalAmount.toLocaleString()}
              onClick={() => {
                void withdrawExtrinsic.signAndSend(account.address)
              }}
            />
          )
        }
        status={
          stake.unlocking.length > 0 && (
            <StakePosition.UnstakingStatus
              amount={stake.totalUnlocking.decimalAmount.toLocaleString()}
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
          amount={stake.locked.decimalAmount.toLocaleString()}
          fiatAmount={stake.locked.localizedFiatAmount}
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
            void unlockExtrinsic.signAndSend(account.address, stake.locked.decimalAmount.planck)
            setLockedDialogOpen(false)
          }}
        />
      )}
    </>
  )
}

const Stakes = () => {
  const chains = useRecoilValue(dappStakingEnabledChainsState)
  const accounts = useRecoilValue(selectedSubstrateAccountsState)

  return (
    <>
      {chains.map((chain, index) => (
        <ErrorBoundary key={index} orientation="horizontal">
          <ChainProvider chain={chain}>
            {accounts.map((account, index) => (
              <Stake key={index} account={account} />
            ))}
          </ChainProvider>
        </ErrorBoundary>
      ))}
    </>
  )
}

export default Stakes
