import StakePosition from '@components/recipes/StakePosition'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { selectedSubstrateAccountsState, type Account } from '@domains/accounts'
import { ChainProvider, dappStakingEnabledChainsState, useChainState } from '@domains/chains'
import { useTokenAmountFromPlanck } from '@domains/common'
import { useClaimAllRewardsExtrinsic, useStake } from '@domains/staking/dappStaking'
import { useState, useTransition } from 'react'
import { useRecoilValue } from 'recoil'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

const Stake = ({ account }: { account: Account }) => {
  const chain = useRecoilValue(useChainState())
  const stake = useStake(account)

  const claimAllRewardsExtrinsic = useClaimAllRewardsExtrinsic(stake)

  const balance = useTokenAmountFromPlanck(stake.totalStaked)
  const totalRewards = useTokenAmountFromPlanck(stake.totalRewards)

  const [addStakeDialogOpen, _setAddStakeDialogOpen] = useState(false)
  const [addStakeDialogInTransition, startAddStakeDialogTransition] = useTransition()
  const setAddStakeDialogOpen = (value: boolean) => startAddStakeDialogTransition(() => _setAddStakeDialogOpen(value))

  const [unstakeDialogOpen, _setUnstakeDialogOpen] = useState(false)
  const [unstakeDialogInTransition, startUnstakeDialogTransition] = useTransition()
  const setUnstakeDialogOpen = (value: boolean) => startUnstakeDialogTransition(() => _setUnstakeDialogOpen(value))

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
        balance={balance.decimalAmount.toHuman()}
        fiatBalance={balance.localizedFiatAmount}
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
        claimButton={
          !totalRewards.decimalAmount.planck.isZero() && (
            <StakePosition.ClaimButton
              loading={claimAllRewardsExtrinsic.state === 'loading'}
              amount={totalRewards.decimalAmount.toHuman()}
              onClick={() => {
                void claimAllRewardsExtrinsic.signAndSend(account.address)
              }}
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
