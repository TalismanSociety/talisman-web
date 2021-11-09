import * as crypto from 'crypto'

import { ApiPromise } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'

import { Moonbeam } from '../crowdloanOverrides'
import moonbeamStatement from './moonbeamStatement'

export async function submitTermsAndConditions(api: ApiPromise, address: string) {
  const injector = await web3FromAddress(address)
  if (!injector || !injector.signer || !injector.signer.signRaw)
    throw new Error('Extension does not support signing messages')

  const hash = crypto.createHash('sha256').update(moonbeamStatement).digest('hex')
  const signature = (await injector.signer.signRaw({ address, data: hash, type: 'bytes' })).signature

  const remark = await agreeRemark(address, signature)
  const [extrinsicHash, blockHash] = await sendRemark(api, address, remark)
  const verified = await verifyRemark(address, extrinsicHash, blockHash)

  return verified
}

async function agreeRemark(address: string, signedMessage: string): Promise<string> {
  return (
    await (
      await fetch(`${Moonbeam.api}/agree-remark`, {
        method: 'POST',
        headers: Moonbeam.apiKey ? { 'x-api-key': Moonbeam.apiKey } : undefined,
        body: JSON.stringify({
          'address': address,
          'signed-message': signedMessage,
        }),
      })
    ).json()
  ).remark
}

function sendRemark(api: ApiPromise, address: string, remark: string): Promise<[string, string]> {
  return new Promise(resolve => {
    const tx = api.tx.system.remark(remark)
    tx.signAndSend(address, ({ status }) => {
      if (!status.isFinalized) return
      resolve([tx.hash.toHex(), status.asFinalized.toHex()])
    })
  })
}

async function verifyRemark(address: string, extrinsicHash: string, blockHash: string): Promise<boolean> {
  return (
    await (
      await fetch(`${Moonbeam.api}/verifyf-remark`, {
        method: 'POST',
        headers: Moonbeam.apiKey ? { 'x-api-key': Moonbeam.apiKey } : undefined,
        body: JSON.stringify({
          'address': address,
          'extrinsic-hash': extrinsicHash,
          'block-hash': blockHash,
        }),
      })
    ).json()
  ).verified
}
