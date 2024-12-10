import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

import { useSubstrateApiState } from '@/domains/common/recoils/api'

import { allDelegateInfosAtomFamily } from '../atoms/delegateInfo'

export const useAllDelegateInfos = () => {
  const api = useRecoilValue(useSubstrateApiState())
  const allDelegateInfos = useAtomValue(allDelegateInfosAtomFamily({ api }))
  return useMemo(() => allDelegateInfos ?? {}, [allDelegateInfos])
}
