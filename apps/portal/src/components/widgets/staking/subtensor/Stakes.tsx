import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import type { StakeItem } from '@/domains/staking/subtensor/hooks/useStake'
import { StakePosition } from '@/components/recipes/StakePosition'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { ROOT_NETUID } from '@/components/widgets/staking/subtensor/constants'
import { selectedSubstrateAccountsState } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { ChainProvider } from '@/domains/chains/provider'
import { subtensorStakingEnabledChainsState } from '@/domains/chains/recoils'
import { useStake } from '@/domains/staking/subtensor/hooks/useStake'

import ErrorBoundaryFallback from '../ErrorBoundaryFallback'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

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
  const { stakes = [] } = useStake(account)

  const [addStakeDialogOpen, setAddStakeDialogOpen] = useState<boolean>(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState<boolean>(false)
  const [selectedStake, setSelectedStake] = useState<StakeItem | undefined>()

  useEffect(() => {
    if (!stakes || stakes.length === 0) return
    setShouldRenderLoadingSkeleton(false)
  }, [setShouldRenderLoadingSkeleton, stakes])

  const handleToggleAddStakeDialog = (stakeItem?: StakeItem | undefined) => {
    setAddStakeDialogOpen(prev => !prev)
    setSelectedStake(stakeItem)
  }

  const handleToggleUnstakeDialog = (stakeItem?: StakeItem | undefined) => {
    setUnstakeDialogOpen(prev => !prev)
    setSelectedStake(stakeItem)
  }

  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}

  if (stakes.length === 0) return null

  return (
    <>
      {stakes.map(stake => {
        const assetSymbol = stake.netuid === ROOT_NETUID ? symbol : `SN${stake.netuid} ${stake.descriptionName ?? ''}`
        return (
          <ErrorBoundary
            key={`${account.address}-${stake.hotkey}-${stake.netuid}`}
            renderFallback={() => (
              <ErrorBoundaryFallback logo={logo} symbol={assetSymbol} provider={name} list="positions" />
            )}
          >
            <StakePosition
              readonly={account.readonly}
              chain={name}
              chainId={chain?.id || ''}
              assetSymbol={assetSymbol}
              assetLogoSrc={logo}
              account={account}
              provider="Delegation"
              stakeStatus={'earning_rewards'}
              balance={
                <ErrorBoundary renderFallback={() => <>--</>}>
                  {stake.totalStaked.decimalAmount?.toLocaleString()}
                </ErrorBoundary>
              }
              fiatBalance={
                <ErrorBoundary renderFallback={() => <>--</>}>{stake.totalStaked.localizedFiatAmount}</ErrorBoundary>
              }
              increaseStakeButton={
                stakes.length > 0 && (
                  <ErrorBoundary renderFallback={() => <>--</>}>
                    <StakePosition.IncreaseStakeButton
                      onClick={() => handleToggleAddStakeDialog(stake)}
                      withTransition
                    />
                  </ErrorBoundary>
                )
              }
              unstakeButton={
                stakes.length > 0 && (
                  <ErrorBoundary renderFallback={() => <>--</>}>
                    <StakePosition.UnstakeButton onClick={() => handleToggleUnstakeDialog(stake)} withTransition />
                  </ErrorBoundary>
                )
              }
            />
          </ErrorBoundary>
        )
      })}
      {addStakeDialogOpen && selectedStake && (
        <AddStakeDialog account={account} stake={selectedStake} onRequestDismiss={() => handleToggleAddStakeDialog()} />
      )}
      {unstakeDialogOpen && selectedStake && (
        <UnstakeDialog account={account} stake={selectedStake} onRequestDismiss={() => handleToggleUnstakeDialog()} />
      )}
    </>
  )
}
