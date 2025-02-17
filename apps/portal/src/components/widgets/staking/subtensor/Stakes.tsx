import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import type { StakeItem } from '@/domains/staking/subtensor/hooks/useStake'
import { selectedSubstrateAccountsState } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { ChainProvider } from '@/domains/chains/provider'
import { subtensorStakingEnabledChainsState } from '@/domains/chains/recoils'
import { useStake } from '@/domains/staking/subtensor/hooks/useStake'

import AddStakeDialog from './AddStakeDialog'
import { StakeItemRow } from './StakeItemRow'
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
  const [addStakeDialogOpen, setAddStakeDialogOpen] = useState<boolean>(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState<boolean>(false)
  const [selectedStake, setSelectedStake] = useState<StakeItem | undefined>()

  const chain = useRecoilValue(useChainState())
  const { stakes = [] } = useStake(account)

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

  if (stakes.length === 0) return null

  return (
    <>
      {stakes.map(stake => {
        return (
          <StakeItemRow
            key={`${account.address}-${stake.hotkey}-${stake.netuid}`}
            stake={stake}
            account={account}
            chain={chain}
            handleToggleAddStakeDialog={handleToggleAddStakeDialog}
            handleToggleUnstakeDialog={handleToggleUnstakeDialog}
          />
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
