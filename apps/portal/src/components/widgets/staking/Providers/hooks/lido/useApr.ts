import { lidoAprState } from '@/domains/staking/lido/recoils'
import { useRecoilValue } from 'recoil'

type UseAprProps = {
  apiEndpoint: string
}

const useApr = ({ apiEndpoint }: UseAprProps) => {
  return useRecoilValue(lidoAprState(apiEndpoint ?? ''))
}

export default useApr
