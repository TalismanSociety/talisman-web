import { useSubstrateApiState } from '../../../common'
import { allDelegateInfosAtomFamily } from '../atoms/delegateInfo'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

export const useAllDelegateInfos = () => {
  const api = useRecoilValue(useSubstrateApiState())
  const allDelegateInfos = useAtomValue(allDelegateInfosAtomFamily({ api }))
  return useMemo(() => allDelegateInfos ?? {}, [allDelegateInfos])
}
