import BN from 'bn.js'
import { useAtomValue } from 'jotai'
import { useRecoilValue } from 'recoil'

import { useNativeTokenAmountState } from '@/domains/chains/recoils'

import { taoTotalStakedTaoAtom } from '../atoms/taostats'

export const useTotalTaoStakedFormatted = () => {
  const totalStaked = useAtomValue(taoTotalStakedTaoAtom)
  const tokenAmount = useRecoilValue(useNativeTokenAmountState())
  const { fiatAmount, localizedFiatAmount, decimalAmount } = tokenAmount.fromPlanck(new BN(totalStaked).toString())
  const { decimals, options } = decimalAmount ?? {}

  const currency = options?.currency

  const formattedTokenAmount = (Number(totalStaked) / Math.pow(10, decimals ?? 0)).toLocaleString(undefined, {
    currency,
    style: 'currency',
  })

  // fiatAmount may be 0, in that case we should return the token amount
  return fiatAmount ? localizedFiatAmount : formattedTokenAmount
}
