import { glmrSlpxPair } from './config'
import { selector, selectorFamily } from 'recoil'

export const slpxPairsState = selector({ key: 'SlpxPairs', get: () => [glmrSlpxPair] })

export const slpxAprState = selectorFamily({
  key: 'SplxApr',
  get: (params: { apiEndpoint: string; nativeTokenSymbol: string }) => async () =>
    await fetch(new URL(`/api/omni/${params.nativeTokenSymbol}`, params.apiEndpoint))
      .then(async x => await x.json())
      .then(x => Number(x.apy.vAPY) / 100),
})
