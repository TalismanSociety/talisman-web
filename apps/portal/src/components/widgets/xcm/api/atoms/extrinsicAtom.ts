import { big } from '@galacticcouncil/xcm-core'
import { atom } from 'jotai'

import { pjsApiAtom } from './pjsApiAtom'
import { transferAtom } from './transferAtom'
import { amountAtom, assetAtom, destChainAtom } from './xcmFieldsAtoms'

export const extrinsicAtom = atom(async get => {
  const asset = get(assetAtom)
  const amount = get(amountAtom)
  const destChain = get(destChainAtom)
  const transfer = await get(transferAtom)
  const api = await get(pjsApiAtom)
  if (!asset || !amount || !destChain || !transfer || !api) return

  const validateAmount = () => {
    const { balance, max, min } = transfer.source

    const minWithRelay = min.copyWith({ amount: destChain.isEvmChain() ? min.amount * 2n : min.amount })

    const amountBn = big.toBigInt(amount, balance.decimals)
    const maxBn = big.toBigInt(max.amount, max.decimals)
    const minBn = big.toBigInt(minWithRelay.amount, min.decimals)

    if (balance.amount === 0n) {
      throw new Error('Your transfer is bigger than your balance.')
    }
    if (amountBn < minBn) {
      throw new Error(
        `The minimum transferable amount is ${minWithRelay.toDecimal(minWithRelay.decimals)} ${asset.originSymbol}.`
      )
    }
    if (amountBn > maxBn) {
      throw new Error(`The maximum transferable amount is ${max.toDecimal(max.decimals)} ${asset.originSymbol}.`)
    }

    return
  }
  validateAmount()

  const validateTransfer = async () => {
    const report = await transfer.validate(transfer.source.fee.amount)
    if (!report.length) return

    // const amount = report[0]?.['amount']
    // const symbol = report[0]?.['asset']
    // const chain = report[0]?.['chain']
    // const lookup = {
    //   'error.required': 'This field is required.',
    //   'error.notEvmAddr': 'The address is incorrect. Please use valid ethereum address.',
    //   'error.notNativeAddr': 'The address is incorrect. Please use valid polkadot address.',
    //   'error.notValidAddr': 'The address is incorrect. Please review it and try again.',
    //   'error.balance': 'Your transfer is bigger than your balance.',
    //   'error.maxAmount': `The maximum transferable amount is ${amount} ${asset}.`,
    //   'error.minAmount': `The minimum transferable amount is ${amount} ${asset}.`,

    //   'error.fee.insufficientBalance': `You need to have ${amount} ${symbol} on ${chain} for fees`,
    //   'error.destFee.insufficientBalance': `You need to have at least ${amount} ${symbol} on ${chain}`,
    //   'error.asset.frozen': `Your account on ${chain} has frozen balance for ${symbol}`,
    //   'error.account.insufficientDeposit': `You need to have ${amount} ${symbol} on ${chain} for existential deposit`,
    // }

    throw new Error(report[0]?.['error'])
  }
  await validateTransfer()

  // TODO: Handle when this throws due to invalid config
  const call = await transfer.buildCall(amount)
  const extrinsic = api.tx(call.data)

  return extrinsic
})
