import type { Account } from '@/domains/accounts/recoils'
import type { StakeItem } from '@/domains/staking/subtensor/hooks/useStake'
import { StakePosition } from '@/components/recipes/StakePosition'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { DTAO_LOGO, ROOT_NETUID } from '@/components/widgets/staking/subtensor/constants'
import { ChainInfo } from '@/domains/chains/recoils'
import { useCombinedBittensorValidatorsData } from '@/domains/staking/subtensor/hooks/useCombinedBittensorValidatorsData'
import { useGetDynamicTaoStakeInfo } from '@/domains/staking/subtensor/hooks/useGetDynamicTaoStakeInfo'
import { useMoveStake } from '@/domains/staking/subtensor/hooks/useMoveStake'
import { type BondOption } from '@/domains/staking/subtensor/types'

import ErrorBoundaryFallback from '../ErrorBoundaryFallback'

type StakeItemRowProps = {
  stake: StakeItem
  account: Account
  chain: ChainInfo
  highlightedDelegate?: BondOption
  handleToggleAddStakeDialog: (stakeItem?: StakeItem | undefined) => void
  handleToggleUnstakeDialog: (stakeItem?: StakeItem | undefined) => void
  handleToggleChangeValidator: (stakeItem?: StakeItem | undefined) => void
}

export const StakeItemRow = ({
  stake,
  account,
  chain,
  highlightedDelegate,
  handleToggleAddStakeDialog,
  handleToggleUnstakeDialog,
  handleToggleChangeValidator,
}: StakeItemRowProps) => {
  const { combinedValidatorsData } = useCombinedBittensorValidatorsData()
  const { expectedTaoAmount } = useGetDynamicTaoStakeInfo({
    amount: stake.totalStaked,
    netuid: stake.netuid,
    direction: 'alphaToTao',
    shouldUpdateFeeAndSlippage: false,
  })

  const { isError, errorMessage } = useMoveStake({
    stake,
    destinationHotkey: highlightedDelegate?.poolId,
  })

  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}
  const assetSymbol = stake.netuid === ROOT_NETUID ? symbol : `SN${stake.netuid} ${stake.descriptionName ?? ''}`
  const assetLogo = stake.netuid === ROOT_NETUID ? logo : DTAO_LOGO
  const provider = combinedValidatorsData.find(({ poolId }) => poolId === stake.hotkey)?.name ?? 'Managed delegation'

  const fiatBalance =
    stake.netuid === ROOT_NETUID ? stake.totalStaked.localizedFiatAmount : expectedTaoAmount.localizedFiatAmount

  return (
    <ErrorBoundary
      key={`${account.address}-${stake.hotkey}-${stake.netuid}`}
      renderFallback={() => (
        <ErrorBoundaryFallback logo={assetLogo} symbol={assetSymbol} provider={name} list="positions" />
      )}
    >
      <StakePosition
        readonly={account.readonly}
        chain={name}
        chainId={chain?.id || ''}
        assetSymbol={assetSymbol}
        assetLogoSrc={assetLogo}
        account={account}
        provider={provider}
        stakeStatus={'earning_rewards'}
        isError={isError}
        errorMessage={errorMessage}
        balance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            {stake.totalStaked.decimalAmount?.toLocaleString()}
          </ErrorBoundary>
        }
        fiatBalance={<ErrorBoundary renderFallback={() => <>--</>}>{fiatBalance}</ErrorBoundary>}
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
        changeValidatorButton={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <StakePosition.ChangeValidatorButton onClick={() => handleToggleChangeValidator(stake)} withTransition />
          </ErrorBoundary>
        }
      />
    </ErrorBoundary>
  )
}
