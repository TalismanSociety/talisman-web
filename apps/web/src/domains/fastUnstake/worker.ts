import { ApiPromise, WsProvider } from '@polkadot/api'
import { range } from 'lodash'
// @ts-expect-error
import { expose } from 'threads/worker'

export type WorkerModule = typeof module

const module = {
  getExposedAccounts: async (endpoint: string | string[] | undefined, activeEra: number) => {
    const api = await ApiPromise.create({ provider: new WsProvider(endpoint) })

    const startEraToCheck = activeEra - api.consts.staking.bondingDuration.toNumber()

    const exposed = await Promise.all(
      range(startEraToCheck, activeEra).map(era =>
        api.query.staking.erasStakers
          .entries(era)
          .then(x => x.flatMap(([_, exposure]) => exposure.others.flatMap(({ who }) => who.toString())))
          .then(array => new Set(array))
      )
    ).then(x => x.reduce((prev, curr) => new Set([...prev, ...curr])))

    await api.disconnect()

    return exposed
  },
}

expose(module)
