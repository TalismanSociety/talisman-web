import { useCallback, useEffect } from 'react'
import { atom, useRecoilState } from 'recoil'
import { Address } from '@util/addresses'
import { useApi } from '../chains/pjs-api'
import { useSelectedMultisig } from '../multisig'

type Validator = {
  address: Address
  name?: string
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
      const addressString = key.toHuman()!.toString()
      const commission = value.commission.toNumber()
      const address = Address.fromSs58(addressString) as Address
      if (address) {
        validatorsMap[addressString] = {
          address,
          commission,
        }
      }
    })

    const validatorsAddresses = Object.keys(validatorsMap)
    const identity = await api.query.identity.identityOf.multi(validatorsAddresses)
    identity.forEach(({ value }, index) => {
      const nameRaw = value?.info?.display.toHuman() as { Raw: string }

      const name = nameRaw?.Raw
      const address = validatorsAddresses[index]
      if (name && address) {
        validatorsMap[address]!.name = name
      }
    })

    setValidators({ validators: validatorsMap, chain: chainName })
  }, [api, multisig.chain.chainName, setValidators, validators])

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
