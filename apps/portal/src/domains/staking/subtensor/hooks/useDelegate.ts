import { delegateAtomFamily } from '../atoms/delegates'
import { useAtomValue } from 'jotai'

export const useDelegate = (address?: string) => useAtomValue(delegateAtomFamily(address))
