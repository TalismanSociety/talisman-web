import StakePosition from '@components/recipes/StakePosition'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { selectedSubstrateAccountsState, type Account } from '@domains/accounts'
import { ChainProvider, dappStakingEnabledChainsState, useChainState } from '@domains/chains'
import { useTokenAmountFromPlanck } from '@domains/common'
import { useClaimAllRewardsExtrinsic, useStake } from '@domains/staking/dappStaking'
import { useRecoilValue } from 'recoil'

const Stake = ({ account }: { account: Account }) => {
  const chain = useRecoilValue(useChainState())
  const stake = useStake(account)

  const claimAllRewardsExtrinsic = useClaimAllRewardsExtrinsic(stake)

  const balance = useTokenAmountFromPlanck(stake.totalStaked)
  const totalRewards = useTokenAmountFromPlanck(stake.totalRewards)

  if (!stake.active) {
    return null
  }

  return (
    <StakePosition
      chain={chain.name}
      symbol={chain.nativeToken?.symbol ?? ''}
      account={account}
      provider="DApp staking"
      stakeStatus={stake.earningRewards ? 'earning_rewards' : 'not_earning_rewards'}
      balance={balance.decimalAmount.toHuman()}
      fiatBalance={balance.localizedFiatAmount}
      increaseStakeButton={<StakePosition.IncreaseStakeButton />}
      unstakeButton={<StakePosition.UnstakeButton />}
      claimButton={
        !totalRewards.decimalAmount.planck.isZero() && (
          <StakePosition.ClaimButton
            amount={totalRewards.decimalAmount.toHuman()}
            onClick={() => {
              void claimAllRewardsExtrinsic.signAndSend(account.address)
            }}
          />
        )
      }
    />
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
