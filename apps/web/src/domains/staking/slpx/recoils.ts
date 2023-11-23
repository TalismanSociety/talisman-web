import { selector } from 'recoil'
import { glmrSlpxPair } from './config'

export const slpxPairsState = selector({ key: 'SlpxPairs', get: () => [glmrSlpxPair] })
