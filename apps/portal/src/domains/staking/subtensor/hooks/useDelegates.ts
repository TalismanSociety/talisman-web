import { useAtomValue } from 'jotai'

import { delegatesAtom } from '../atoms/delegates'

export const useDelegates = () => useAtomValue(delegatesAtom)
