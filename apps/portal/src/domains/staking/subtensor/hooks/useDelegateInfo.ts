import { useAtomValue } from 'jotai'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

import { useSubstrateApiState } from '@/domains/common/recoils/api'

import { delegateInfoAtomFamily } from '../atoms/delegateInfo'

export const useDelegateInfo = (delegateAddress: string) => {
  const api = useRecoilValue(useSubstrateApiState())
  return useAtomValue(delegateInfoAtomFamily({ api, delegateAddress }))
}
