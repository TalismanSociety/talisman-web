import { useRecoilValue } from 'recoil'

import { lidoAprState } from '@/domains/staking/lido/recoils'

type UseAprProps = {
  apiEndpoint: string
}

const useApr = ({ apiEndpoint }: UseAprProps) => {
  return useRecoilValue(lidoAprState(apiEndpoint ?? ''))
}

export default useApr
