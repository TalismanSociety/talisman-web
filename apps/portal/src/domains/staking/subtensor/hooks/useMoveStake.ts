import { type SubmittableExtrinsic } from '@polkadot/api/types'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { MIN_SUBTENSOR_ROOTNET_STAKE, ROOT_NETUID } from '@/components/widgets/staking/subtensor/constants'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useExtrinsic } from '@/domains/common/hooks/useExtrinsic'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { useTokenAmount } from '@/domains/common/hooks/useTokenAmount'
import { useGetDynamicTaoStakeInfo } from '@/domains/staking/subtensor/hooks/useGetDynamicTaoStakeInfo'

import { type StakeItem } from './useStake'

type MoveItem = {
  stake: StakeItem | undefined
  destinationHotkey: string | undefined
}

export const useMoveStake = ({ stake, destinationHotkey }: MoveItem) => {
  const api = useRecoilValue(useSubstrateApiState())
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  const { hotkey: originHotkey, netuid: originNetuid, stake: alphaAmount, netuid, symbol } = stake || {}
  const formattedAlphaAmount = nativeTokenAmount.fromPlanckOrUndefined(alphaAmount, symbol)

  const { minAlphaUnstake } = useGetDynamicTaoStakeInfo({
    amount: formattedAlphaAmount,
    netuid: netuid ?? 0,
    direction: 'alphaToTao',
    shouldUpdateFeeAndSlippage: false,
  })

  const isRootnetStake = netuid === ROOT_NETUID
  const minimum = useTokenAmount(String(isRootnetStake ? MIN_SUBTENSOR_ROOTNET_STAKE : minAlphaUnstake))
  const minimumFormatted = nativeTokenAmount.fromPlanckOrUndefined(minimum.decimalAmount?.planck ?? 0n, stake?.symbol)

  const { isError, errorMessage } = useMemo(() => {
    const validations: Array<{ condition: boolean; message: string }> = [
      {
        condition: (formattedAlphaAmount.decimalAmount?.planck ?? 0n) < (minimumFormatted.decimalAmount?.planck ?? 0n),
        message: `Minimum staked amount for changing validator is ${minimumFormatted.decimalAmount?.toLocaleStringPrecision()}`,
      },
    ]

    const firstError = validations.find(v => v.condition)

    return {
      isError: Boolean(firstError),
      errorMessage: firstError?.message ?? null,
    }
  }, [formattedAlphaAmount.decimalAmount, minimumFormatted.decimalAmount])

  const isReady = stake && destinationHotkey && originHotkey !== destinationHotkey

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tx: SubmittableExtrinsic<any> = useMemo(() => {
    // Return null if stake or destinationHotkey is not defined
    if (!stake || !destinationHotkey) return api.tx.system.remarkWithEvent('talisman-bittensor')

    return api.tx.utility.batchAll([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (api.tx as any)?.subtensorModule?.moveStake?.(
        originHotkey,
        destinationHotkey,
        originNetuid,
        originNetuid, // destinationNetuid, in this case, is the same as originNetuid
        alphaAmount
      ),
      api.tx.system.remarkWithEvent('talisman-bittensor'),
    ])
  }, [stake, destinationHotkey, api.tx, originHotkey, originNetuid, alphaAmount])

  const extrinsic = useExtrinsic(tx)

  return { extrinsic, isReady, isError, errorMessage }
}
