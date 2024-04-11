import { ApiPromise, WsProvider } from '@polkadot/api'
import { encodeAddress } from '@polkadot/util-crypto'
import { Observable } from 'rxjs'
import { expose } from 'threads/worker'
import { getErasToCheck } from './utils'

export type WorkerFunction = typeof getExposure

export type ExposureRecord = Record<number, Record<string, boolean>>

const generateExposure = async function* (
  endpoint: string,
  activeEra: number,
  addresses: readonly string[],
  precomputedExposure?: ExposureRecord
) {
  const api = await ApiPromise.create({ provider: new WsProvider(endpoint), initWasm: false })
  const encodedAddresses = addresses.map(x => encodeAddress(x, api.registry.chainSS58))

  try {
    const exposure = precomputedExposure ?? {}

    for (const era of getErasToCheck(activeEra, api.consts.staking.bondingDuration.toNumber())) {
      const eraExposure = exposure[era] ?? {}

      const addressesToCheck = encodedAddresses.filter(address => !(address in eraExposure))

      if (addressesToCheck.length > 0) {
        const exposeds = await api.query.staking.erasStakers
          .entries(era)
          .then(x => new Set(x.flatMap(([_, exposure]) => exposure.others.flatMap(({ who }) => who.toString()))))

        for (const address of addressesToCheck) {
          eraExposure[address] = exposeds.has(address)
        }
      }

      for (const [address, exposed] of Object.entries(eraExposure)) {
        yield { era, address, exposed }
      }

      if (Object.values(eraExposure).every(exposed => exposed)) {
        break
      }
    }
  } finally {
    void api.disconnect()
  }
}

const getExposure = (
  endpoint: string,
  activeEra: number,
  addresses: readonly string[],
  precomputedExposure?: ExposureRecord
) =>
  new Observable<{ era: number; address: string; exposed: boolean }>(observer => {
    const exposureGenerator = generateExposure(endpoint, activeEra, addresses, precomputedExposure)

    void (async () => {
      try {
        for await (const exposure of exposureGenerator) {
          observer.next(exposure)
        }
      } catch (error) {
        observer.error(error)
      } finally {
        observer.complete()
      }
    })()

    return () => {
      void exposureGenerator.return()
    }
  })

expose(getExposure)
