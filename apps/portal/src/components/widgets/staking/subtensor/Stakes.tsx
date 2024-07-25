import { selectedSubstrateAccountsState, type Account } from '../../../../domains/accounts'
import { ChainProvider, subtensorStakingEnabledChainsState, useChainState } from '../../../../domains/chains'
import { useStake } from '../../../../domains/staking/subtensor/hooks/useStake'
import ErrorBoundary from '../../ErrorBoundary'
import ErrorBoundaryFallback from '../ErrorBoundaryFallback'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'
import { StakePosition } from '@talismn/ui-recipes'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

type StakesProps = {
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}
const Stakes = ({ setShouldRenderLoadingSkeleton }: StakesProps) => {
  const chains = useRecoilValue(subtensorStakingEnabledChainsState)
  const accounts = useRecoilValue(selectedSubstrateAccountsState)

  return (
    <>
      {chains.map((chain, index) => (
        <ChainProvider key={index} chain={chain}>
          {accounts.map((account, index) => (
            <Stake key={index} account={account} setShouldRenderLoadingSkeleton={setShouldRenderLoadingSkeleton} />
          ))}
        </ChainProvider>
      ))}
    </>
  )
}
export default Stakes

type StakeProps = {
  account: Account
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}
const Stake = ({ account, setShouldRenderLoadingSkeleton }: StakeProps) => {
  const chain = useRecoilValue(useChainState())
  const stake = useStake(account)

  const [addStakeDialogOpen, setAddStakeDialogOpen] = useState(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState(false)

  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}

  useEffect(() => {
    if (!stake.stakes || stake.stakes.length === 0) return
    setShouldRenderLoadingSkeleton(false)
  }, [setShouldRenderLoadingSkeleton, stake.stakes])

  if (!stake.stakes) return null

  return (
    <ErrorBoundary
      renderFallback={() => <ErrorBoundaryFallback logo={logo} symbol={symbol} provider={name} list="positions" />}
    >
      <StakePosition
        readonly={account.readonly}
        chain={name}
        assetSymbol={symbol}
        assetLogoSrc={logo}
        account={account}
        provider="Delegation"
        stakeStatus={'earning_rewards'}
        balance={stake.totalStaked.decimalAmount?.toLocaleString()}
        fiatBalance={stake.totalStaked.localizedFiatAmount}
        increaseStakeButton={
          stake.stakes.length > 0 && (
            <StakePosition.IncreaseStakeButton onClick={() => setAddStakeDialogOpen(true)} withTransition />
          )
        }
        unstakeButton={
          stake.stakes.length > 0 && (
            <StakePosition.UnstakeButton onClick={() => setUnstakeDialogOpen(true)} withTransition />
          )
        }
      />
      {addStakeDialogOpen && (
        <AddStakeDialog account={account} stake={stake} onRequestDismiss={() => setAddStakeDialogOpen(false)} />
      )}
      {unstakeDialogOpen && (
        <UnstakeDialog account={account} stake={stake} onRequestDismiss={() => setUnstakeDialogOpen(false)} />
      )}
    </ErrorBoundary>
  )
}
