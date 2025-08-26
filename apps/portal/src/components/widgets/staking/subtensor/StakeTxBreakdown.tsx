import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { classNames } from '@talismn/util'
import { Info } from '@talismn/web-icons'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useGetSeekDiscount } from '@/domains/staking/seek/hooks/useGetSeekDiscount'
import { dTaoConversionRateAtom } from '@/domains/staking/subtensor/atoms/dTaoConversionRate'
import { expectedAlphaAmountAtom } from '@/domains/staking/subtensor/atoms/expectedAlphaAmount'
import { feeEstimateAtom } from '@/domains/staking/subtensor/atoms/feeEstimate'
import { netuidAtom } from '@/domains/staking/subtensor/atoms/netuid'
import { talismanTokenFeeAtom } from '@/domains/staking/subtensor/atoms/talismanTokenFee'
import { useCombineSubnetData } from '@/domains/staking/subtensor/hooks/useCombineSubnetData'

import { ROOT_NETUID, TALISMAN_FEE_BITTENSOR } from './constants'
import { SlippageDropdown } from './SlippageDropdown'

type StakeTxBreakdownProps = {
  shouldHideExpectedAmount?: boolean
}

export const StakeTxBreakdown = ({ shouldHideExpectedAmount }: StakeTxBreakdownProps) => {
  const [talismanFeeTokenAmount] = useAtom(talismanTokenFeeAtom)
  const [expectedAlphaAmount] = useAtom(expectedAlphaAmountAtom)
  const [dTaoConversionRate] = useAtom(dTaoConversionRateAtom)
  const [feeEstimate] = useAtom(feeEstimateAtom)
  const [netuid] = useAtom(netuidAtom)
  const { subnetData } = useCombineSubnetData()
  const { tier } = useGetSeekDiscount()

  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  const discountPercent = `${tier.discount * 100}%`

  const stakeData = subnetData[netuid ?? 0]
  const { symbol, descriptionName } = stakeData || {}

  const alphaTokenSymbol = useMemo(() => {
    return netuid ? `SN${netuid} ${descriptionName} ${symbol}` : '-'
  }, [descriptionName, netuid, symbol])

  const formattedExpectedAlphaAmount = nativeTokenAmount.fromPlanckOrUndefined(
    expectedAlphaAmount?.decimalAmount?.planck ?? 0n,
    alphaTokenSymbol
  )

  const formattedConversionRate = nativeTokenAmount.fromPlanckOrUndefined(
    dTaoConversionRate?.decimalAmount?.planck ?? 0n,
    netuid === ROOT_NETUID ? '-' : symbol
  )

  return (
    <div className="space-y-4 text-[14px]">
      {!shouldHideExpectedAmount && (
        <div className="flex items-center justify-between">
          <div className="text-gray-400">Expected amount</div>
          <div className="text-end">
            {netuid ? formattedExpectedAlphaAmount?.decimalAmount?.toLocaleString() : 'Select Subnet'}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-gray-400">Conversion Rate</div>
        <div className="text-end">
          {netuid ? `1 TAO = ${formattedConversionRate?.decimalAmount?.toLocaleString()}` : 'Select Subnet'}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 leading-none">
          <div className="text-gray-400">Estimated Network Fee</div>
          <Tooltip
            content={
              <div className="max-w-[35rem]">Approximate transaction cost based on current network conditions.</div>
            }
            placement="top"
          >
            <Info size={16} className="text-gray-400" />
          </Tooltip>
        </div>
        <div className="text-end">{feeEstimate?.decimalAmount?.toLocaleString()}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 leading-none">
            <div className="text-gray-400">Talisman fee</div>
            <Tooltip
              content={
                <div className="max-w-[35rem]">
                  Talisman applies a {TALISMAN_FEE_BITTENSOR}% fee to each transaction.
                </div>
              }
              placement="top"
            >
              <Info size={16} className="text-gray-400" />
            </Tooltip>
          </div>
          {tier.tier > 0 && (
            <div className="rounded-[43px] bg-[#D5FF5C] bg-opacity-[0.1] px-4 py-1">
              <div className="text-[10px] text-[#D5FF5C]">{discountPercent} Off Fees</div>
            </div>
          )}
        </div>
        <div className={classNames(tier.tier > 0 && 'text-[#D5FF5C]')}>
          {talismanFeeTokenAmount?.decimalAmount?.toLocaleStringPrecision()}
        </div>
      </div>
      <SlippageDropdown />
    </div>
  )
}
