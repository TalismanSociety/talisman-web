import { delegatesAtom } from '../atoms/delegates'
import { useAtomValue } from 'jotai'

export const useDelegates = () => useAtomValue(delegatesAtom)
