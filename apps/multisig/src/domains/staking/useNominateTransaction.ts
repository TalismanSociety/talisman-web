import { useMemo } from 'react'
import { TransactionApprovals, TransactionType, useNextTransactionSigner, useSelectedMultisig } from '../multisig'
import { BondedPool } from './NomPoolsWatcher'
import { useApi } from '../chains/pjs-api'
import { Address } from '../../util/addresses'
import { useApproveAsMulti } from '../chains'

export const useNominateTransaction = (
  address: Address,
  description: string,
  validators: string[],
  pool?: BondedPool
) => {
  const [multisig] = useSelectedMultisig()
  const { api } = useApi(multisig.chain.rpcs)

  const extrinsic = useMemo(() => {
    if (!api) return undefined

    if (!api.tx.proxy || !api.tx.proxy.proxy) return console.warn('Proxy pallet not supported on this chain.')

    try {
      // if pool exists, create a nom pool nominate extrinsic
      if (pool) {
        if (!api.tx.nominationPools || !api.tx.nominationPools.nominate) {
          // pallet not supported! UI should've handled this case so users should never reach here
          return console.warn('nominate() does not exist in nominationPools pallet.')
        }
        const nomPoolExtrinsic = api.tx.nominationPools.nominate(pool.id, validators)
        return api.tx.proxy.proxy(multisig.proxyAddress.bytes, null, nomPoolExtrinsic)
      }

      // if pool isn't provided, we will nominate with staking pallet as a nominator
      if (!api.tx.staking) return console.warn('nominate() does not exist in staking pallet.')

      const stakingNominate = api.tx.staking.nominate(validators)

      // TODO: check that proxy address is same as address
      // if not same, this is a nested proxy call
      return api.tx.proxy.proxy(multisig.proxyAddress.bytes, null, stakingNominate)
    } catch (e) {
      console.error(e)
    }
    return undefined
  }, [api, multisig.proxyAddress.bytes, pool, validators])

  const hash = extrinsic?.registry.hash(extrinsic.method.toU8a()).toHex()

  const transaction = useMemo(() => {
    if (!extrinsic || !hash) return undefined

    return {
      date: new Date(),
      hash,
      description,
      chain: multisig.chain,
      multisig,
      approvals: multisig.signers.reduce((acc, key) => {
        acc[key.toPubKey()] = false
        return acc
      }, {} as TransactionApprovals),
      decoded: {
        type: pool ? TransactionType.NominateFromNomPool : TransactionType.NominateFromStaking,
        recipients: [],
      },
      calldata: extrinsic.method.toHex(),
    }
  }, [description, extrinsic, hash, multisig, pool])

  const signer = useNextTransactionSigner(transaction?.approvals)
  const { approveAsMulti, estimatedFee, ready } = useApproveAsMulti(signer?.address, hash, null, transaction?.multisig)

  return { approveAsMulti, estimatedFee, ready, transaction, hash }
}
