import { ExtractAtomValue } from 'jotai'

import { xcmDestChainsAtom } from '../atoms/xcmDestChainsAtom'
import { xcmSourceChainsAtom } from '../atoms/xcmSourceChainsAtom'
import { xcmTokenPickerDestAtom } from '../atoms/xcmTokenPickerDestAtom'
import { xcmTokenPickerSourceAtom } from '../atoms/xcmTokenPickerSourceAtom'

export type TokenPickerAsset = TokenPickerSource | TokenPickerDest
export type TokenPickerSource = Awaited<ExtractAtomValue<typeof xcmTokenPickerSourceAtom>>[0]
export type TokenPickerDest = Awaited<ExtractAtomValue<typeof xcmTokenPickerDestAtom>>[0]

export type TokenPickerChain = SourceChain | DestChain
export type SourceChain = Awaited<ExtractAtomValue<typeof xcmSourceChainsAtom>>[0]
export type DestChain = Awaited<ExtractAtomValue<typeof xcmDestChainsAtom>>[0]
