import { type SubmittableExtrinsic } from '@polkadot/api/types'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { useExtrinsic } from '@/domains/common/hooks/useExtrinsic'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'

import { type StakeItem } from './useStake'

type MoveItem = {
  stake: StakeItem | undefined
  destinationHotkey: string | undefined
}

export const useMoveStake = ({ stake, destinationHotkey }: MoveItem) => {
  const api = useRecoilValue(useSubstrateApiState())
  const { hotkey: originHotkey, netuid: originNetuid, stake: alphaAmount } = stake || {}
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
      api.tx.system.remarkWithEvent(`talisman-bittensor`),
    ])
  }, [stake, destinationHotkey, api.tx, originHotkey, originNetuid, alphaAmount])

  const extrinsic = useExtrinsic(tx)

  return { extrinsic, isReady }
}
