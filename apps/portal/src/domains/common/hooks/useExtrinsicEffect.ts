import { useEffect, type EffectCallback } from 'react'
import type { ExtrinsicLoadable } from '.'

export const useExtrinsicInBlockOrErrorEffect = (effect: EffectCallback, extrinsicLoadable: ExtrinsicLoadable) => {
  useEffect(
    () => {
      if (
        extrinsicLoadable.state === 'hasError' ||
        (extrinsicLoadable.state === 'loading' && extrinsicLoadable.contents?.status.isInBlock)
      ) {
        return effect()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [extrinsicLoadable.contents?.status?.isInBlock, extrinsicLoadable.state]
  )
}
