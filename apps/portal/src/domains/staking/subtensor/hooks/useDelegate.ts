import { useAtomValue } from 'jotai'

import { delegateAtomFamily } from '../atoms/delegates'

export const useDelegate = (address?: string) => useAtomValue(delegateAtomFamily(address))
