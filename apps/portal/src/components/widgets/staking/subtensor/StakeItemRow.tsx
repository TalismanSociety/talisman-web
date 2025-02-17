import type { Account } from '@/domains/accounts/recoils'
import type { StakeItem } from '@/domains/staking/subtensor/hooks/useStake'
import { StakePosition } from '@/components/recipes/StakePosition'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { ROOT_NETUID } from '@/components/widgets/staking/subtensor/constants'
import { ChainInfo } from '@/domains/chains/recoils'
import { useTotalStaked } from '@/domains/staking/hooks'
import { useGetDynamicTaoStakeInfo } from '@/domains/staking/subtensor/hooks/useGetDynamicTaoStakeInfo'

import ErrorBoundaryFallback from '../ErrorBoundaryFallback'

type StakeItemRowProps = {
  stake: StakeItem
  account: Account
  chain: ChainInfo
  handleToggleAddStakeDialog: (stakeItem?: StakeItem | undefined) => void
  handleToggleUnstakeDialog: (stakeItem?: StakeItem | undefined) => void
}

export const StakeItemRow = ({
  stake,
  account,
  chain,
  handleToggleAddStakeDialog,
  handleToggleUnstakeDialog,
}: StakeItemRowProps) => {
  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}
  const assetSymbol = stake.netuid === ROOT_NETUID ? symbol : `SN${stake.netuid} ${stake.descriptionName ?? ''}`

  const { expectedTaoAmount } = useGetDynamicTaoStakeInfo({
    amount: stake.totalStaked,
    netuid: stake.netuid,
    direction: 'alphaToTao',
  })

  return (
    <ErrorBoundary
      key={`${account.address}-${stake.hotkey}-${stake.netuid}`}
      renderFallback={() => <ErrorBoundaryFallback logo={logo} symbol={assetSymbol} provider={name} list="positions" />}
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
          <ErrorBoundary renderFallback={() => <>--</>}>{expectedTaoAmount.localizedFiatAmount}</ErrorBoundary>
        }
        increaseStakeButton={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <StakePosition.IncreaseStakeButton onClick={() => handleToggleAddStakeDialog(stake)} withTransition />
          </ErrorBoundary>
        }
        unstakeButton={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <StakePosition.UnstakeButton onClick={() => handleToggleUnstakeDialog(stake)} withTransition />
          </ErrorBoundary>
        }
      />
    </ErrorBoundary>
  )
}
