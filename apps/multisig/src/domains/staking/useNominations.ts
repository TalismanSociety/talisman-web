import { useCallback, useEffect, useRef, useState } from 'react'
import { useApi } from '../chains/pjs-api'
import { useSelectedMultisig } from '../multisig'
import { Chain } from '../chains'
import { VoidFn } from '@polkadot/api/types'
import { useRecoilValue } from 'recoil'
import { validatorsState } from './ValidatorsWatcher'

export type Nomination = {
  address: string
  name?: string
  subName?: string
}

export const useNominations = (
  chain: Chain,
  address?: string
): { nominations: Nomination[] | undefined; isReady: boolean } => {
  const [multisig] = useSelectedMultisig()
  const { api } = useApi(multisig.chain.rpcs)
  const [nominations, setNominations] = useState<string[] | undefined>()
  const unsub = useRef<VoidFn | null>(null)
  const validators = useRecoilValue(validatorsState)

  const subscribeNominators = useCallback(async () => {
    if (!api || !api.query || nominations || !address) return

    if (!api.query.staking || !api.query.staking.nominators) {
      setNominations([])
      return
    }

    const u = await api.query.staking.nominators(address, nominationsRaw => {
      if (nominationsRaw.value.isEmpty) {
        setNominations([])
      } else {
        setNominations(nominationsRaw.value.targets.toHuman() as string[])
      }
    })

    unsub.current = u
  }, [address, api, nominations])

  useEffect(() => {
    if (nominations) return
    subscribeNominators()
  }, [nominations, subscribeNominators])

  useEffect(() => {
    if (unsub.current) {
      unsub.current()
      unsub.current = null
    }
    setNominations(undefined)
  }, [address, chain])

  useEffect(() => () => unsub.current?.(), [])

  return {
    nominations: nominations?.map(addressString => ({
      // dont need to parse to Address class because we don't need to convert this address between chains
      address: addressString,
      name: validators?.validators[addressString]?.name,
      subName: validators?.validators[addressString]?.subName,
    })),
    isReady: validators !== undefined && nominations !== undefined,
  }
}
