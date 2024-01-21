import StakePosition from '@components/recipes/StakePosition'
import { selectedSubstrateAccountsState, type Account } from '@domains/accounts'
import { ChainProvider, defaultParams, useChainState } from '@domains/chains'
import { useTokenAmountFromPlanck } from '@domains/common'
import { useStake } from '@domains/staking/dappStaking'
import { useRecoilValue } from 'recoil'

const Stake = ({ account }: { account: Account }) => {
  const chain = useRecoilValue(useChainState())
  const stake = useStake(account)

  const balance = useTokenAmountFromPlanck(stake.totalStaked)

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
    />
  )
}

const Stakes = () => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)

  return (
    <>
      {accounts.map((account, index) => (
        <Stake key={index} account={account} />
      ))}
    </>
  )
}

export default () => (
  <ChainProvider
    chain={{
      genesisHash: '0xddb89973361a170839f80f152d2e9e38a376a5a7eccefcade763f46a8e567019',
      parameters: defaultParams,
      priorityPool: undefined,
    }}
  >
    <Stakes />
  </ChainProvider>
)
