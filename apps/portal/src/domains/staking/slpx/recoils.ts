import { selector, selectorFamily, useRecoilValue } from 'recoil'

import { glmrSlpxPair, mantaSlpxPair } from './config'

export const slpxPairsState = selector({ key: 'SlpxPairs', get: () => [mantaSlpxPair, glmrSlpxPair] })

export const slpxAprState = selectorFamily({
  key: 'SplxApr',
  get: (params: { apiEndpoint: string; nativeTokenSymbol: string }) => async () =>
    await fetch(new URL(`/api/omni/${params.nativeTokenSymbol}`, params.apiEndpoint))
      .then(async x => await x.json())
      .then(x => Number(x.apy.vAPY) / 100),
})

export const useSlpxAprState = ({
  apiEndpoint,
  nativeTokenSymbol,
}: {
  apiEndpoint: string
  nativeTokenSymbol: string
}) => useRecoilValue(slpxAprState({ apiEndpoint, nativeTokenSymbol }))
