import { useAtomValue } from 'jotai'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'

import { delegateInfosAtomFamily } from '../atoms/delegateInfo'

export const useDelegateInfos = (delegateAddresses: string[]) => {
  const api = useRecoilValue(useSubstrateApiState())
  return useAtomValue(delegateInfosAtomFamily({ api, delegateAddresses }))
}
