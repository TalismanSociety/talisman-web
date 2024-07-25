import { useSubstrateApiState } from '../../../common'
import { delegateInfoAtomFamily } from '../atoms/delegateInfo'
import { useAtomValue } from 'jotai'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

export const useDelegateInfo = (delegateAddress: string) => {
  const api = useRecoilValue(useSubstrateApiState())
  return useAtomValue(delegateInfoAtomFamily({ api, delegateAddress }))
}
