import { taoTotalStakedTaoAtom } from '../atoms/taostats'
import { useNativeTokenAmountState } from '@/domains/chains'
import BN from 'bn.js'
import { useAtomValue } from 'jotai'
import { useRecoilValue } from 'recoil'

export const useTotalTaoStakedFormatted = () => {
  const totalStaked = useAtomValue(taoTotalStakedTaoAtom)
  const tokenAmount = useRecoilValue(useNativeTokenAmountState())
  const {
    fiatAmount,
    localizedFiatAmount,
    decimalAmount: { decimals, options },
  } = tokenAmount.fromPlanck(new BN(totalStaked).toString())

  const currency = options?.currency

  const formattedTokenAmount = (Number(totalStaked) / Math.pow(10, decimals)).toLocaleString(undefined, {
    currency,
    style: 'currency',
  })

  // fiatAmount may be 0, in that case we should return the token amount
  return fiatAmount ? localizedFiatAmount : formattedTokenAmount
}
