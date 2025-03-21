import { SurfaceChip } from '@talismn/ui/atoms/Chip'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { InfoCard } from '@talismn/ui/molecules/InfoCard'
import { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet } from '@talismn/ui/molecules/SideSheet'
import { Clock, Zap } from '@talismn/web-icons'
import { formatDistance } from 'date-fns'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'

import { SlpxAddStakeForm } from '@/components/recipes/AddStakeDialog'
import { useAccountSelector } from '@/components/widgets/AccountSelector'
import useSlpxSubstrateUnlockDuration from '@/components/widgets/staking/providers/hooks/bifrost/useSlpxSubstrateUnlockDuration'
import { writeableSubstrateAccountsState } from '@/domains/accounts/recoils'
import { useSlpxAprState } from '@/domains/staking/slpx/recoils'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import useStakeAddForm from '@/domains/staking/slpxSubstrate/useStakeAddForm'

type Props = {
  slpxPair: SlpxSubstratePair
  onRequestDismiss: () => void
}

const AddStakeSideSheet = ({ slpxPair, onRequestDismiss }: Props) => {
  const [[account], accountSelector] = useAccountSelector(useRecoilValue(writeableSubstrateAccountsState), 0)

  const { amount, setAmount, availableBalance, rate, newStakedTotal, extrinsic, error } = useStakeAddForm({
    slpxPair,
  })

  const { amount: amountAvailable, amountAfterFee, fiatAmount: fiatAmountAvailable } = availableBalance

  return (
    <SideSheet
      title={
        <div className="flex items-center gap-2">
          <Zap />
          Stake
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
              {useSlpxAprState({
                apiEndpoint: slpxPair.apiEndpoint,
                nativeTokenSymbol: slpxPair.nativeToken.symbol,
              }).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}
            </Suspense>
          }
        />
        <InfoCard
          overlineContent="Unbonding period"
          headlineContent={
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              {formatDistance(0, useSlpxSubstrateUnlockDuration({ slpxPair }) || 0).toLocaleString()}
            </Suspense>
          }
        />
      </div>
      <Surface css={{ padding: '1.6rem', borderRadius: '1.6rem' }}>
        <SlpxAddStakeForm
          confirmState={
            !amount || !!error ? 'disabled' : extrinsic?.state === 'loading' || !extrinsic ? 'pending' : undefined
          }
          accountSelector={accountSelector}
          amount={amount}
          fiatAmount={fiatAmountAvailable}
          newAmount={newStakedTotal?.toLocaleString() ?? '...'}
          newFiatAmount={null}
          onChangeAmount={setAmount}
          availableToStake={amountAvailable.toLocaleString()}
          rate={`1 ${slpxPair.nativeToken.symbol} = ${rate.toLocaleString()} ${slpxPair.vToken.symbol}`}
          onConfirm={() => extrinsic?.signAndSend(account?.address ?? '').then(() => onRequestDismiss())}
          onRequestMaxAmount={() => {
            if (amountAfterFee !== undefined && amountAfterFee.planck > 0) {
              setAmount(amountAfterFee.toString())
            }
          }}
          isError={!!error}
          inputSupportingText={error?.message}
        />
      </Surface>
      <Text.Body as="p" css={{ marginTop: '4.8rem' }}>
        {`To get started with Bifrost Liquid Staking for ${slpxPair.nativeToken.symbol}, you'll need ${slpxPair.nativeToken.symbol} on ${slpxPair.chainName}. Once staked, you'll receive ${slpxPair.vToken.symbol} (voucher ${slpxPair.nativeToken.symbol}) as your liquid staking token, which has fully underlying ${slpxPair.nativeToken.symbol} reserve and is directly yield bearing.`}{' '}
        <Text.Noop.A target="blank" href="https://bifrost.io/#liquidStaking">
          Learn more
        </Text.Noop.A>
      </Text.Body>
      <div className="mt-2 flex justify-end">
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
