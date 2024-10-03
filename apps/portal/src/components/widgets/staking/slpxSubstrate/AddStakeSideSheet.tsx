import { evmSignableAccountsState, writeableEvmAccountsState } from '../../../../domains/accounts'
import { useAccountSelector } from '../../AccountSelector'
import { walletConnectionSideSheetOpenState } from '../../WalletConnectionSideSheet'
import Apr from '../slpx/Apr'
import UnlockDuration from './UnlockDuration'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { Tooltip } from '@talismn/ui'
import {
  Button,
  CircularProgressIndicator,
  InfoCard,
  SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR,
  SideSheet,
  Surface,
  Text,
  SurfaceChip,
} from '@talismn/ui'
import { Zap, Clock } from '@talismn/web-icons'
import { Suspense } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

type Props = {
  slpxPair: SlpxSubstratePair
  onRequestDismiss: () => void
}

const AddStakeSideSheet = ({ slpxPair, onRequestDismiss }: Props) => {
  const [[account], accountSelector] = useAccountSelector(useRecoilValue(evmSignableAccountsState), 0)
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const writeableEvmAccounts = useRecoilValue(writeableEvmAccountsState)

  return (
    <SideSheet
      title={
        <div>
          <Zap /> Stake
        </div>
      }
      subtitle="Liquid Staking"
      onRequestDismiss={onRequestDismiss}
      css={{ [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '48rem' } }}
    >
      <div css={{ display: 'flex', gap: '1.6rem', marginBottom: '1.6rem', flexWrap: 'wrap', '> *': { flex: 1 } }}>
        <InfoCard
          overlineContent="Rewards"
          headlineContent={
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <Apr slpxPair={slpxPair} />
            </Suspense>
          }
        />
        <InfoCard
          overlineContent="Unbonding period"
          headlineContent={
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <UnlockDuration slpxPair={slpxPair} />
            </Suspense>
          }
        />
      </div>
      <Surface css={{ padding: '1.6rem', borderRadius: '1.6rem' }}>
        {/* <SlpxAddStakeForm
          confirmState={
            !ready || +amount === 0
              ? 'disabled'
              : mint.isPending || approve.isPending || approveTransaction.isLoading
              ? 'pending'
              : undefined
          }
          approvalNeeded={approvalNeeded}
          accountSelector={
            writeableEvmAccounts.length > 0 ? (
              accountSelector
            ) : (
              <Button className="!w-full !rounded-[12px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
                Connect Ethereum Wallet
              </Button>
            )
          }
          amount={amount}
          fiatAmount={localizedFiatAmount ?? '...'}
          newAmount={newAmount?.toLocaleString() ?? '...'}
          newFiatAmount={null}
          onChangeAmount={setAmount}
          availableToStake={available?.toLocaleString() ?? '...'}
          rate={Maybe.of(rate).mapOr(
            '...',
            rate => `1 ${props.slpxPair.nativeToken.symbol} = ${rate.toLocaleString()} ${props.slpxPair.vToken.symbol}`
          )}
          onConfirm={async () => {
            if (approvalNeeded) {
              await approve.writeContractAsync()
            } else {
              await mint.writeContractAsync()
            }
          }}
          onRequestMaxAmount={() => {
            if (available !== undefined) {
              setAmount(available.toString())
            }
          }}
          isError={error !== undefined}
          inputSupportingText={error?.message}
        /> */}
      </Surface>
      <Text.Body as="p" css={{ marginTop: '4.8rem' }}>
        {`To get started with Bifrost Liquid Staking for ${slpxPair.nativeToken.symbol}, you'll need ${slpxPair.nativeToken.symbol} on ${slpxPair.chainName}. Once staked, you'll receive ${slpxPair.vToken.symbol} (voucher ${slpxPair.nativeToken.symbol}) as your liquid staking token, which has fully underlying ${slpxPair.nativeToken.symbol} reserve and is directly yield bearing.`}{' '}
        <Text.Noop.A target="blank" href="https://bifrost.io/#liquidStaking">
          Learn more
        </Text.Noop.A>
      </Text.Body>
      <div className="flex justify-end mt-2">
        <Tooltip content="Transaction may take several minutes to complete">
          <SurfaceChip className="cursor-default">
            <Clock />
            5-10 minutes
          </SurfaceChip>
        </Tooltip>
      </div>
    </SideSheet>
  )
}

export default AddStakeSideSheet
