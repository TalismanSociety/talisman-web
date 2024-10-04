import { writeableSubstrateAccountsState } from '../../../../domains/accounts/recoils'
import { SlpxAddStakeForm } from '../../../recipes/AddStakeDialog'
import { useAccountSelector } from '../../AccountSelector'
import Apr from '../slpx/Apr'
import UnlockDuration from './UnlockDuration'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { Tooltip } from '@talismn/ui'
import {
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
import { useRecoilValue } from 'recoil'

type Props = {
  slpxPair: SlpxSubstratePair
  onRequestDismiss: () => void
}

const AddStakeSideSheet = ({ slpxPair, onRequestDismiss }: Props) => {
  const [[account], accountSelector] = useAccountSelector(useRecoilValue(writeableSubstrateAccountsState), 0)

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
        <SlpxAddStakeForm
          // confirmState={
          //   !ready || +amount === 0
          //     ? 'disabled'
          //     : mint.isPending || approve.isPending || approveTransaction.isLoading
          //     ? 'pending'
          //     : undefined
          // }
          confirmState={undefined}
          approvalNeeded={false}
          // approvalNeeded={approvalNeeded}
          accountSelector={accountSelector}
          // amount={amount}
          amount="123"
          // fiatAmount={localizedFiatAmount ?? '...'}
          fiatAmount="999 BRL"
          // newAmount={newAmount?.toLocaleString() ?? '...'}
          newAmount="10000 BRL"
          newFiatAmount={null}
          // onChangeAmount={setAmount}
          onChangeAmount={() => console.log('Changed amount')}
          // availableToStake={available?.toLocaleString() ?? '...'}
          availableToStake="12345 BRL"
          // rate={Maybe.of(rate).mapOr(
          //   '...',
          //   rate => `1 ${props.slpxPair.nativeToken.symbol} = ${rate.toLocaleString()} ${props.slpxPair.vToken.symbol}`
          // )}
          rate={'1 BRL = 1 vBRL'}
          // onConfirm={async () => {
          //   if (approvalNeeded) {
          //     await approve.writeContractAsync()
          //   } else {
          //     await mint.writeContractAsync()
          //   }
          // }}
          onConfirm={() => console.log('Confirmed')}
          // onRequestMaxAmount={() => {
          //   if (available !== undefined) {
          //     setAmount(available.toString())
          //   }
          // }}
          onRequestMaxAmount={() => console.log('Requested max amount')}
          // isError={error !== undefined}
          isError
          // inputSupportingText={error?.message}
        />
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
