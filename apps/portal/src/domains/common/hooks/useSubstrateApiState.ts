import { useSubstrateApiEndpoint } from '@/domains/common/hooks/useSubstrateApiEndpoint'
import { substrateApiState } from '@/domains/common/recoils/api'

export const useSubstrateApiState = () => substrateApiState(useSubstrateApiEndpoint())
