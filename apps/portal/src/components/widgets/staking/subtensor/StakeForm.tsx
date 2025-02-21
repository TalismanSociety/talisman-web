import type { ReactNode } from 'react'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { useQueryClient } from '@tanstack/react-query'
import BN from 'bn.js'
import { Suspense, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { Account } from '@/domains/accounts/recoils'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useAddStakeForm } from '@/domains/staking/subtensor/hooks/forms'
import { useDelegateApr } from '@/domains/staking/subtensor/hooks/useApr'
import { useCombineSubnetData } from '@/domains/staking/subtensor/hooks/useCombineSubnetData'
import { useStake } from '@/domains/staking/subtensor/hooks/useStake'

import { SubtensorStakingForm } from './SubtensorStakingForm'

type StakeFormProps = IncompleteSelectionStakeFormProps & {
  account: Account
  delegate: string | undefined
  netuid: number | undefined
  isSelectSubnetDisabled: boolean
}

export const StakeForm = (props: StakeFormProps) => {
  const { stakes } = useStake(props.account)
  const { subnetData } = useCombineSubnetData()
  const stake = stakes?.find(stake => stake.hotkey === props.delegate && Number(stake.netuid) === Number(props.netuid))
  const stakeData = subnetData[props.netuid ?? 0]
  const { input, amount, transferable, extrinsic, ready, error, expectedAlphaAmount, isLoading, setInput } =
    useAddStakeForm(props.account, stake, props.delegate, props.netuid)
  const navigate = useNavigate()
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())
  const queryClient = useQueryClient()

  const handleStakeInfoRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['stakeInfoForColdKey', props.account.address] })
  }

  const alphaTokenSymbol = useMemo(() => {
    const { netuid, symbol, descriptionName } = stakeData || stake || {}
    return netuid ? `SN${netuid} ${descriptionName} ${symbol}` : 'DTao'
  }, [stake, stakeData])

  const formattedExpectedAlphaAmount = nativeTokenAmount.fromPlanckOrUndefined(
    expectedAlphaAmount?.decimalAmount?.planck ?? 0n,
    alphaTokenSymbol
  )

  return (
    <SubtensorStakingForm
      accountSelector={props.accountSelector}
      expectedAmount={formattedExpectedAlphaAmount?.decimalAmount?.toLocaleString()}
      amountInput={
        <SubtensorStakingForm.AmountInput
          amount={input}
          fiatAmount={amount.localizedFiatAmount}
          onChangeAmount={setInput}
          onRequestMaxAmount={() => setInput(transferable.decimalAmount.toString())}
          availableToStake={transferable.decimalAmount.toLocaleString()}
          assetSelector={props.assetSelector}
          error={error?.message}
          isLoading={isLoading}
        />
      }
      selectionInProgress={props.selectionInProgress}
      subnetSelectionInProgress={props.subnetSelectionInProgress}
      selectedName={props.selectedName}
      selectedSubnetName={props.selectedSubnetName}
      onRequestChange={props.onRequestChange}
      onSelectSubnet={props.onSelectSubnet}
      isSelectSubnetDisabled={props.isSelectSubnetDisabled}
      stakeButton={
        <SubtensorStakingForm.StakeButton
          disabled={!ready}
          loading={isLoading}
          onClick={() => {
            extrinsic.signAndSend(props.account.address).then(() => {
              handleStakeInfoRefetch()

              navigate('/staking/positions')
            })
          }}
        />
      }
      estimatedRewards={
        <Suspense fallback={<CircularProgressIndicator size="1em" />}>
          <EstimatedRewards
            delegateHotkey={props.delegate || ''}
            amount={(amount.decimalAmount?.planck ?? 0n) + (stake?.totalStaked.decimalAmount?.planck ?? 0n)}
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
  subnetSelectionInProgress?: boolean
  selectedName?: string
  selectedSubnetName?: string
  isSelectSubnetDisabled: boolean
  onRequestChange: () => unknown
  onSelectSubnet: () => void
}
export const IncompleteSelectionStakeForm = ({
  accountSelector,
  assetSelector,
  selectedName,
  selectedSubnetName,
  isSelectSubnetDisabled,
  onRequestChange,
  onSelectSubnet,
}: IncompleteSelectionStakeFormProps) => (
  <SubtensorStakingForm
    accountSelector={accountSelector}
    amountInput={<SubtensorStakingForm.AmountInput assetSelector={assetSelector} disabled />}
    selectedName={selectedName}
    selectedSubnetName={selectedSubnetName}
    onRequestChange={onRequestChange}
    onSelectSubnet={onSelectSubnet}
    isSelectSubnetDisabled={isSelectSubnetDisabled}
    stakeButton={<SubtensorStakingForm.StakeButton disabled />}
    estimatedRewards="..."
  />
)

const EstimatedRewards = (props: { amount: bigint; delegateHotkey: string }) => {
  const tokenAmount = useRecoilValue(useNativeTokenAmountState())
  const delegateApr = useDelegateApr(props.delegateHotkey) || 0
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
