import { useSubstrateApiState } from '../../../common'
import { delegateInfosAtomFamily } from '../atoms/delegateInfo'
import { useAtomValue } from 'jotai'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

export const useDelegateInfos = (delegateAddresses: string[]) => {
  const api = useRecoilValue(useSubstrateApiState())
  return useAtomValue(delegateInfosAtomFamily({ api, delegateAddresses }))
}
