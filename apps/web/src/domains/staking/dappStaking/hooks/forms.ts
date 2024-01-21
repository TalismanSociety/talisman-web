import type { Account } from '@domains/accounts'
import {
  paymentInfoState,
  useExtrinsic,
  useSubstrateApiEndpoint,
  useSubstrateApiState,
  useTokenAmountState,
} from '@domains/common'
import type { AstarPrimitivesDappStakingSmartContract } from '@polkadot/types/lookup'
import { useQueryState } from '@talismn/react-polkadot-api'
import { Maybe } from '@util/monads'
import BN from 'bn.js'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

const ESTIMATED_FEE_MARGIN_OF_ERROR = 0.25

export const useDappStakingAddForm = (
  account: Account,
  dapp: string | AstarPrimitivesDappStakingSmartContract | Uint8Array | { Evm: any } | { Wasm: any }
) => {
  const [input, setAmount] = useTokenAmountState('')

  const [api, accountInfo, ledger] = useRecoilValue(
    waitForAll([
      useSubstrateApiState(),
      useQueryState('system', 'account', [account.address]),
      useQueryState('dappStaking', 'ledger', [account.address]),
    ])
  )

  const transferable = accountInfo.data.free.sub(accountInfo.data.frozen)
  const locked = ledger.locked.unwrap()

  const amountToLock = Maybe.of(input.decimalAmount?.planck).mapOrUndefined(x => x.sub(locked))

  const submittable = useMemo(() => {
    if (amountToLock?.isZero()) {
      return api.tx.dappStaking.stake(dapp, input.decimalAmount?.planck ?? 0)
    }

    return api.tx.utility.batchAll([
      api.tx.dappStaking.lock(amountToLock ?? 0),
      api.tx.dappStaking.stake(dapp, input.decimalAmount?.planck ?? 0),
    ])
  }, [amountToLock, api.tx.dappStaking, api.tx.utility, dapp, input.decimalAmount?.planck])

  const extrinsic = useExtrinsic(submittable)
  const paymentInfo = useRecoilValue(
    paymentInfoState([
      useSubstrateApiEndpoint(),
      // @ts-expect-error
      submittable.method.section,
      // @ts-expect-error
      submittable.method.method,
      // @ts-expect-error
      submittable.args,
    ])
  )

  return {
    ready: input.decimalAmount !== undefined,
    input,
    setAmount,
    available: useMemo(
      () =>
        transferable
          .sub(api.consts.balances.existentialDeposit)
          .add(locked)
          .sub(paymentInfo?.partialFee.muln(ESTIMATED_FEE_MARGIN_OF_ERROR) ?? new BN(0)),
      [api.consts.balances.existentialDeposit, locked, paymentInfo?.partialFee, transferable]
    ),
    extrinsic,
  }
}

export const useDappStakingUnstakeForm = (
  account: Account,
  dapp: string | AstarPrimitivesDappStakingSmartContract | Uint8Array | { Evm: any } | { Wasm: any }
) => {
  const [input, setAmount] = useTokenAmountState('')

  const [api, stakerInfo] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useQueryState('dappStaking', 'stakerInfo', [account.address, dapp])])
  )

  const submittable = useMemo(() => {
    return api.tx.utility.batchAll([
      api.tx.dappStaking.unstake(dapp, input.decimalAmount?.planck ?? 0),
      api.tx.dappStaking.unlock(input.decimalAmount?.planck ?? 0),
    ])
  }, [api.tx.dappStaking, api.tx.utility, dapp, input.decimalAmount?.planck])

  const extrinsic = useExtrinsic(submittable)

  return {
    ready: input.decimalAmount !== undefined,
    input,
    setAmount,
    available: useMemo(
      () =>
        stakerInfo
          .unwrapOrDefault()
          .staked.voting.unwrap()
          .add(stakerInfo.unwrapOrDefault().staked.buildAndEarn.unwrap()),
      [stakerInfo]
    ),
    extrinsic,
  }
}
