import { writeableSubstrateAccountsState } from '@domains/accounts/recoils'
import { useSubstrateApiEndpoint, useSubstrateApiState } from '@domains/common'
import { encodeAddress } from '@polkadot/util-crypto'
import { bool, coercion, jsonParser, writableDict } from '@recoiljs/refine'
import { useQueryState } from '@talismn/react-polkadot-api'
import { useMemo } from 'react'
import { DefaultValue, atomFamily, useRecoilValue } from 'recoil'
import { Thread, spawn } from 'threads'
import { getErasToCheck } from './utils'
import { type WorkerFunction } from './worker'

const getExposureKey = (genesisHash: string) => `fast-unstake-exposure/${genesisHash}`

const exposureChecker = writableDict(writableDict(bool()))
const exposureCoercion = coercion(exposureChecker)
const exposureJsonParser = jsonParser(exposureChecker)

const unexposedAddressesState = atomFamily<
  Record<string, boolean | undefined>,
  { endpoint: string; genesisHash: string; activeEra: number; bondingDuration: number; addresses: string[] }
>({
  default: ({ addresses }) => Object.fromEntries(addresses.map(x => [x, undefined])),
  key: 'UnexposedAddresses',
  effects: ({ endpoint, genesisHash, activeEra, bondingDuration, addresses }) => [
    ({ setSelf }) => {
      if (addresses.length === 0) {
        return
      }

      const exposure = exposureJsonParser(localStorage.getItem(getExposureKey(genesisHash))) ?? {}

      const storeExposure = () => {
        const coercedExposure = exposureCoercion(exposure)

        if (coercedExposure !== undefined && coercedExposure !== null) {
          localStorage.setItem(getExposureKey(genesisHash), JSON.stringify(coercedExposure))
        }
      }

      // Remove old precomputed eras
      const erasToCheck = new Set(getErasToCheck(activeEra, bondingDuration))
      for (const era of Object.keys(exposure)) {
        if (!erasToCheck.has(Number(era))) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete exposure[era]
        }
      }

      storeExposure()

      const subscriptionPromise = spawn<WorkerFunction>(
        new Worker(new URL('./worker', import.meta.url), { type: 'module' })
      ).then(worker =>
        worker(endpoint, activeEra, addresses, exposure).subscribe({
          next: ({ era, address, exposed }) => {
            if (exposed) {
              setSelf(x => ({ ...x, [encodeAddress(address)]: !exposed }))
            }

            if (era in exposure) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              exposure[era]![address] = exposed
            } else {
              exposure[era] = { [address]: exposed }
            }

            storeExposure()
          },
          error: () => {
            void Thread.terminate(worker)
          },
          complete: () => {
            void Thread.terminate(worker)
            storeExposure()
            setSelf(x => {
              if (x instanceof DefaultValue) {
                return x
              }

              return Object.fromEntries(Object.entries(x).map(([key, value]) => [key, value ?? true]))
            })
          },
        })
      )

      return () => {
        void subscriptionPromise.then(subscription => subscription.unsubscribe())
      }
    },
  ],
})

export const useInjectedAccountFastUnstakeEligibility = () => {
  const api = useRecoilValue(useSubstrateApiState())

  const accounts = useRecoilValue(writeableSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const bondedAccounts = useRecoilValue(useQueryState('staking', 'bonded.multi', addresses))

  const addressesToRunExposureCheck = useMemo(
    () => addresses.filter((_, index) => bondedAccounts[index]?.isSome),
    [addresses, bondedAccounts]
  )

  return {
    ...useMemo(
      () =>
        Object.fromEntries(
          addresses.filter(address => !addressesToRunExposureCheck.includes(address)).map(address => [address, false])
        ),
      [addresses, addressesToRunExposureCheck]
    ),
    ...useRecoilValue(
      unexposedAddressesState({
        endpoint: useSubstrateApiEndpoint(),
        genesisHash: api.genesisHash.toHex(),
        activeEra: useRecoilValue(useQueryState('staking', 'activeEra', [])).unwrapOrDefault().index.toNumber(),
        bondingDuration: api.consts.staking.bondingDuration.toNumber(),
        addresses: addressesToRunExposureCheck,
      })
    ),
  }
}
