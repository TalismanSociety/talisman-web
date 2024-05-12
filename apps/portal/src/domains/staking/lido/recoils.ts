import { lidoMainnet } from './config'
import { selector, selectorFamily } from 'recoil'

export const lidoSuitesState = selector({ key: 'LidoSuites', get: () => [lidoMainnet] })

export const lidoAprState = selectorFamily({
  key: 'LidoApr',
  get: (apiEndpoint: string) => async () =>
    await fetch(new URL('v1/protocol/steth/apr/sma', apiEndpoint))
      .then(async x => await x.json())
      .then(x => x.data.smaApr / 100),
})
