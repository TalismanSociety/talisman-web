import type { ReactNode } from 'react'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import BN from 'bn.js'
import { Suspense, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { Account } from '@/domains/accounts/recoils'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useAddStakeForm } from '@/domains/staking/subtensor/hooks/forms'
import { useDelegateApr } from '@/domains/staking/subtensor/hooks/useApr'
import { useStake } from '@/domains/staking/subtensor/hooks/useStake'

import { SubtensorStakingForm } from './SubtensorStakingForm'

type StakeFormProps = IncompleteSelectionStakeFormProps & {
  account: Account
  delegate: string
}

export const StakeForm = (props: StakeFormProps) => {
  const stake = useStake(props.account)
  const { input, setInput, amount, transferable, extrinsic, ready, error } = useAddStakeForm(
    props.account,
    stake,
    props.delegate
  )
  const navigate = useNavigate()

  return (
    <SubtensorStakingForm
      accountSelector={props.accountSelector}
      amountInput={
        <SubtensorStakingForm.AmountInput
          amount={input}
          fiatAmount={amount.localizedFiatAmount}
          onChangeAmount={setInput}
          onRequestMaxAmount={() => setInput(transferable.decimalAmount.toString())}
          availableToStake={transferable.decimalAmount.toLocaleString()}
          assetSelector={props.assetSelector}
          error={error?.message}
          isLoading={extrinsic.state === 'loading'}
        />
      }
      selectionInProgress={props.selectionInProgress}
      selectedName={props.selectedName}
      onRequestChange={props.onRequestChange}
      stakeButton={
        <SubtensorStakingForm.StakeButton
          disabled={!ready}
          loading={extrinsic.state === 'loading'}
          onClick={() => {
            extrinsic.signAndSend(props.account.address).then(() => navigate('/staking/positions'))
          }}
        />
      }
      estimatedRewards={
        <Suspense fallback={<CircularProgressIndicator size="1em" />}>
          <EstimatedRewards
            delegateHotkey={props.delegate}
            amount={(amount.decimalAmount?.planck ?? 0n) + (stake.totalStaked.decimalAmount?.planck ?? 0n)}
          />
        </Suspense>
      }
      currentStakedBalance={
        (stake?.totalStaked?.decimalAmount?.planck ?? 0n) > 0n
          ? stake?.totalStaked?.decimalAmount?.toLocaleString?.()
          : undefined
      }
    />
  )
}

type IncompleteSelectionStakeFormProps = {
  accountSelector: ReactNode
  assetSelector: ReactNode
  selectionInProgress?: boolean
  selectedName?: ReactNode
  onRequestChange: () => unknown
}
export const IncompleteSelectionStakeForm = (props: IncompleteSelectionStakeFormProps) => (
  <SubtensorStakingForm
    accountSelector={props.accountSelector}
    amountInput={<SubtensorStakingForm.AmountInput assetSelector={props.assetSelector} disabled />}
    selectedName={props.selectedName}
    onRequestChange={props.onRequestChange}
    stakeButton={<SubtensorStakingForm.StakeButton disabled />}
    estimatedRewards="..."
  />
)

const EstimatedRewards = (props: { amount: bigint; delegateHotkey: string }) => {
  const tokenAmount = useRecoilValue(useNativeTokenAmountState())
  // const apr = useApr()
  const delegateApr = useDelegateApr(props.delegateHotkey)
  const amount = useMemo(
    () => tokenAmount.fromPlanck(new BN(props.amount.toString()).muln(delegateApr).toString()),
    [delegateApr, props.amount, tokenAmount]
  )

  if (amount.decimalAmount === undefined) return null

  return (
    <>
      {amount.decimalAmount.toLocaleString()} / Year ({amount.localizedFiatAmount})
    </>
  )
}
