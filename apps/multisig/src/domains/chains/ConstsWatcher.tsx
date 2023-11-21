import { useCallback, useEffect } from 'react'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { useSelectedMultisig } from '../multisig'
import { useApi } from './pjs-api'
import { ApiPromise } from '@polkadot/api'
import { Chain } from './tokens'

type Consts = {
  maxNominations: number
  poolPalletId: Uint8Array
}

/** Consts of each chain, keyed by chain name */
export const constsState = atom<Record<string, Consts>>({
  key: 'constsKey',
  default: {},
})

export const ConstsWatcher: React.FC = () => {
  const [multisig] = useSelectedMultisig()
  const [consts, setConsts] = useRecoilState(constsState)
  const { api } = useApi(multisig.chain.rpcs)

  const fetchConsts = useCallback(
    async (api: ApiPromise, chainName: string) => {
      if (consts[chainName]) return

      const [maxNominationsRes, palletIdRes] = await Promise.all([
        api.consts.staking?.maxNominations,
        api.consts.nominationPools?.palletId,
      ])

      const maxNominations = maxNominationsRes ? +maxNominationsRes.toBigInt().toString() : 16
      const palletId = palletIdRes ? +palletIdRes.toU8a() : new Uint8Array(0)
      setConsts({
        ...consts,
        [chainName]: {
          maxNominations,
          poolPalletId: palletId,
        } as Consts,
      })
    },
    [consts, setConsts]
  )

  useEffect(() => {
    if (!api) return
    fetchConsts(api, multisig.chain.chainName)
  }, [api, fetchConsts, multisig.chain.chainName])

  return null
}

export default ConstsWatcher

export const useConsts = (chain: Chain) => {
  const consts = useRecoilValue(constsState)

  return { consts: consts[chain.chainName] }
}
