import type { EffectCallback } from 'react'
import { useEffect } from 'react'

import type { ExtrinsicLoadable } from '@/domains/common/hooks/useExtrinsic'

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
