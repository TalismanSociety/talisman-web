import BN from 'bn.js'
import { useRecoilValue } from 'recoil'

import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useCombinedBittensorValidatorsData } from '@/domains/staking/subtensor/hooks/useCombinedBittensorValidatorsData'

export const useTotalValidatorStakedFormatted = (hotkey: string | undefined) => {
  const { combinedValidatorsData } = useCombinedBittensorValidatorsData()
  const tokenAmount = useRecoilValue(useNativeTokenAmountState())

  const delegate = combinedValidatorsData.find(validator => validator?.poolId === hotkey)

  const { fiatAmount, localizedFiatAmount, decimalAmount } = tokenAmount.fromPlanck(
    new BN(delegate?.totalStaked ?? '').toString()
  )

  // fiatAmount may be 0, in that case we should return the token amount
  return fiatAmount ? localizedFiatAmount : decimalAmount.toLocaleString()
}
