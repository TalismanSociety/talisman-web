import { getErasToCheck } from './utils'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { encodeAddress } from '@polkadot/util-crypto'
import { Observable } from 'rxjs'
import { expose } from 'threads/worker'

export type WorkerFunction = typeof getExposure

export type ExposureRecord = Record<number, Record<string, boolean>>

// DEPRECATION: Paged Rewards
//
// Temporary until paged rewards migration has completed on all networks. Wait 84 eras from Polkadot
// start: 1420 + 84 = 1504, when full history depth will be moved over to new paged rewards storage.
const pagedRewardsActiveEras: Record<`0x${string}`, number> = {
  // Polkadot
  '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3': 1420,
  // Kusama
  '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe': 6514,
  // Westend
  '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e': 7167,
}

const getEraExposeds = async (api: ApiPromise, era: number) => {
  const pagedRewardsActiveEra = pagedRewardsActiveEras[api.genesisHash.toHex()]
  if (pagedRewardsActiveEra === undefined || pagedRewardsActiveEra < era) {
    const stakers = await api.query.staking.erasStakers.entries(era)

    const exposeds = stakers
      .map(staker => staker[1])
      .flatMap(staker => staker.others.map(other => other.who.toString()))

    return new Set(exposeds)
  }

  const stakerKeys = await api.query.staking.erasStakersOverview.keys(era)
  const stakers = await Promise.all(
    stakerKeys
      .map(key => key.args[1])
      .map(async address => await api.query.staking.erasStakersPaged.entries(era, address))
  )

  const exposeds = stakers
    .flat()
    .map(staker => staker[1])
    .filter(staker => staker.isSome)
    .flatMap(staker => staker.unwrap().others.map(other => other.who.toString()))

  return new Set(exposeds)
}

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
        const exposeds = await getEraExposeds(api, era)

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
