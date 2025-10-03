import { Button } from '@talismn/ui/atoms/Button'
import { SurfaceChip } from '@talismn/ui/atoms/Chip'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { InfoCard } from '@talismn/ui/molecules/InfoCard'
import { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet } from '@talismn/ui/molecules/SideSheet'
import { Clock, Zap } from '@talismn/web-icons'
import { formatDistance } from 'date-fns'
import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { AddStakeForm } from '@/components/recipes/AddStakeDialog'
import { useAccountSelector } from '@/components/widgets/AccountSelector'
import { walletConnectionSideSheetOpenState } from '@/components/widgets/WalletConnectionSideSheet'
import { evmSignableAccountsState } from '@/domains/accounts/recoils'
import { SEEK_TICKER } from '@/domains/staking/seek/constants'

import useGetSeekStakeMpr from '../hooks/seek/useGetSeekStakeMpr'
import useGetSeekStakeUnlockDuration from '../hooks/seek/useGetSeekStakeUnlockDuration'
import useStakeSeek from '../hooks/seek/useStakeSeek'

const AddStakeSideSheet = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const open = searchParams.get('action') === 'stake' && searchParams.get('type') === 'seek'

  const evmSignableAccounts = useRecoilValue(evmSignableAccountsState).filter(x => x.canSignEvm)
  const [[account], accountSelector] = useAccountSelector(evmSignableAccounts, 0)
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const unlockDuration = useGetSeekStakeUnlockDuration()
  const monthlyAPR = useGetSeekStakeMpr()

  const navigate = useNavigate()

  const handleTransactionSuccess = useCallback(() => {
    navigate('/staking/positions')
  }, [navigate])

  const {
    available,
    newStakedTotal,
    setAmountInput,
    approvalNeeded,
    approve,
    approveTransaction,
    stake,
    stakeTransaction,
    error,
    isReady,
    input: { amountInput },
  } = useStakeSeek({ account, onTransactionSuccess: handleTransactionSuccess })

  if (!open) {
    return null
  }

  const handleRequestDismiss = () =>
    setSearchParams(sp => {
      sp.delete('action')
      sp.delete('type')
      sp.delete('contract-address')
      return sp
    })

  return (
    <SideSheet
      title={
        <div className="flex items-center gap-2">
          <Zap />
          Stake
        </div>
      }
      subtitle="Talisman Staking"
      onRequestDismiss={handleRequestDismiss}
      css={{ [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '48rem' } }}
    >
      <div css={{ display: 'flex', gap: '1.6rem', marginBottom: '1.6rem', flexWrap: 'wrap', '> *': { flex: 1 } }}>
        <InfoCard
          overlineContent="Rewards"
          headlineContent={
            <div>{monthlyAPR.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}</div>
          }
        />
        <InfoCard overlineContent="Unbonding period" headlineContent={<div>{formatDistance(0, unlockDuration)}</div>} />
      </div>
      <Surface css={{ padding: '1.6rem', borderRadius: '1.6rem' }}>
        <AddStakeForm
          confirmState={
            !isReady || Number(amountInput) === 0
              ? 'disabled'
              : stake.isPending || stakeTransaction.isLoading || approve.isPending || approveTransaction.isLoading
              ? 'pending'
              : undefined
          }
          approvalNeeded={approvalNeeded}
          accountSelector={
            evmSignableAccounts.length > 0 ? (
              accountSelector
            ) : (
              <Button className="!w-full !rounded-[12px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
                Connect Ethereum Wallet
              </Button>
            )
          }
          availableToStake={available?.toLocaleString()}
          amount={amountInput}
          fiatAmount=""
          newAmount={newStakedTotal.toLocaleString()}
          newFiatAmount={null}
          onChangeAmount={setAmountInput}
          onRequestMaxAmount={() => setAmountInput(available?.toString() ?? '')}
          onConfirm={async () => {
            if (approvalNeeded) {
              try {
                await approve.writeContractAsync()
              } catch (error) {
                console.error(`An error occurred while approving allowance for asset: ${SEEK_TICKER}`, error)
              }
            } else {
              try {
                await stake.writeContractAsync()
              } catch (error) {
                console.error(`An error occurred while staking asset: ${SEEK_TICKER}`, error)
              }
            }
          }}
          isError={error !== undefined}
          inputSupportingText={error?.message}
        />
      </Surface>
      <Text.Body as="p" css={{ marginTop: '4.8rem' }}>
        {`Stake your ${SEEK_TICKER} tokens to access exclusive fee discounts when staking TAO on our platform. This is more than just a staking token, ${SEEK_TICKER} is at the core of a new generation of crypto wallets powered by AI agents, designed to make web3 smarter, safer, and more intuitive. Additional benefits for $NEW stakers will be introduced in the future, bringing even more value to early supporters. Learn more`}{' '}
        <Text.Noop.A target="blank" href="https://talisman.xyz/">
          Learn more
        </Text.Noop.A>
      </Text.Body>
      <Text.Body as="p" css={{ marginTop: '1.6rem' }}>
        You’ll need ETH on Ethereum Mainnet to cover transaction fees.
      </Text.Body>
      <div className="mt-2 flex justify-end">
        <Tooltip content="Transaction may take several minutes to complete">
          <SurfaceChip className="cursor-default">
            <Clock />
            1-2 minutes
          </SurfaceChip>
        </Tooltip>
      </div>
    </SideSheet>
  )
}

export default AddStakeSideSheet
