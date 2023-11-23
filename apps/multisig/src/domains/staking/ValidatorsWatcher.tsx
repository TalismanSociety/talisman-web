import { useCallback, useEffect } from 'react'
import { atom, useRecoilState } from 'recoil'
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util'
import { useApi } from '../chains/pjs-api'
import { useSelectedMultisig } from '../multisig'
import { ApiPromise } from '@polkadot/api'

export type Validator = {
  address: string
  name?: string
  subName?: string
  commission: number
}

export const validatorsState = atom<{ validators: Record<string, Validator>; chain: string } | undefined>({
  key: 'validatorsStateKey',
  default: undefined,
})

export const ValidatorsWatcher: React.FC = () => {
  const [multisig] = useSelectedMultisig()
  const { api } = useApi(multisig.chain.rpcs)
  const [validators, setValidators] = useRecoilState(validatorsState)

  const fetchIdentities = useCallback(async (addresses: string[], api: ApiPromise) => {
    if (!api.query.identity.identityOf) return []
    const identities = await api.query.identity.identityOf.multi(addresses)
    const addressesWithIdentity: [string, string][] = []
    identities.forEach(({ value }, index) => {
      const nameRaw = value?.info?.display.toHuman() as { Raw: string }
      let name = nameRaw?.Raw
      const address = addresses[index]

      name = u8aToString(u8aUnwrapBytes(name))

      if (name && address) addressesWithIdentity.push([address, name])
    })
    return addressesWithIdentity
  }, [])

  const fetchSupersIdentities = useCallback(
    async (addresses: string[], api: ApiPromise) => {
      if (!api.query.identity.superOf) return []

      const addressesWithIdentity: [string, { name: string; subName: string }][] = []
      const addressesWithSubIdentity: [string, { subIdentity: string; superAddress: string }][] = []
      const supersRaw = (await api.query.identity.superOf.multi(addresses)).map(superOf => superOf.toHuman())
      supersRaw.forEach((superOf, index) => {
        if (!superOf) return

        const address = addresses[index]
        const superOfRaw = superOf as [string, { Raw: string }]
        let subIdentity = superOfRaw[1].Raw
        // check if super raw has been encoded
        subIdentity = u8aToString(u8aUnwrapBytes(subIdentity))
        addressesWithSubIdentity.push([address!, { subIdentity, superAddress: superOfRaw[0] }])
      })

      const superIdentities = await fetchIdentities(
        addressesWithSubIdentity.map(([, { superAddress }]) => superAddress),
        api
      )
      superIdentities.forEach(([, name], index) => {
        const [address, { subIdentity }] = addressesWithSubIdentity[index]!
        addressesWithIdentity.push([address, { name, subName: subIdentity }])
      })

      return addressesWithIdentity
    },
    [fetchIdentities]
  )

  const fetchValidators = useCallback(async () => {
    if (!api || !api.query || validators !== undefined) return

    const chainName = multisig.chain.chainName
    if (!api.query.nominationPools) {
      setValidators({
        validators: {},
        chain: multisig.chain.chainName,
      })
      return
    }

    const validatorsRaw = await api.query.staking.validators.entries()
    const validatorsMap: Record<string, Validator> = {}

    validatorsRaw.forEach(([key, value]) => {
      const address = key.toHuman()!.toString()
      const commission = value.commission.toNumber()
      validatorsMap[address] = {
        address,
        commission,
      }
    })

    const validatorsAddresses = Object.keys(validatorsMap)
    const [validatorsIdentities, superIdentities] = await Promise.all([
      fetchIdentities(validatorsAddresses, api),
      fetchSupersIdentities(validatorsAddresses, api),
    ])

    validatorsIdentities.forEach(([address, name]) => {
      validatorsMap[address]!.name = name
    })

    superIdentities.forEach(([address, { name, subName }]) => {
      validatorsMap[address]!.name = name
      validatorsMap[address]!.subName = subName
    })

    setValidators({ validators: validatorsMap, chain: chainName })
  }, [api, fetchSupersIdentities, fetchIdentities, multisig.chain.chainName, setValidators, validators])

  useEffect(() => {
    if (validators) return
    fetchValidators()
  }, [fetchValidators, validators])

  useEffect(() => {
    if (!validators || multisig.chain.chainName === validators.chain) return
    setValidators(undefined)
  }, [multisig.chain.chainName, setValidators, validators])

  return null
}
