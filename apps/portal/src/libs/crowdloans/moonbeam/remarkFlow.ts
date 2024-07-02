import { Moonbeam } from '../crowdloanOverrides'
import moonbeamStatement from './moonbeamStatement'
import { type ApiPromise } from '@polkadot/api'
import { type Signer } from '@polkadot/api/types'
import * as crypto from 'crypto'

export async function submitTermsAndConditions(api: ApiPromise, address: string, signer: Signer) {
  if (!signer?.signRaw) throw new Error('Extension does not support signing messages')

  const hash = crypto.createHash('sha256').update(moonbeamStatement).digest('hex')
  const signature = (await signer.signRaw({ address, data: hash, type: 'bytes' }))?.signature

  const remark = await agreeRemark(address, signature)
  if (!remark) throw new Error('No remark')
  const [extrinsicHash, blockHash] = await sendRemark(api, signer, address, remark)
  if (!extrinsicHash || !blockHash) throw new Error('No tx info')
  const verified = await verifyRemark(address, extrinsicHash, blockHash)

  return verified
}

async function agreeRemark(address: string, signedMessage: string): Promise<string> {
  return (
    await (
      await fetch(`${Moonbeam.api ?? ''}/agree-remark`, {
        method: 'POST',
        headers: Moonbeam.apiKey ? { 'x-api-key': Moonbeam.apiKey } : undefined,
        body: JSON.stringify({
          address,
          'signed-message': signedMessage,
        }),
      })
    ).json()
  ).remark
}

async function sendRemark(api: ApiPromise, signer: Signer, address: string, remark: string): Promise<[string, string]> {
  return await new Promise(resolve => {
    const tx = api.tx.system.remark(remark)
    void tx.signAndSend(address, { signer, withSignedTransaction: true }, ({ status }) => {
      if (!status.isFinalized) return
      resolve([tx.hash.toHex(), status.asFinalized.toHex()])
    })
  })
}

async function verifyRemark(address: string, extrinsicHash: string, blockHash: string): Promise<boolean> {
  return (
    await (
      await fetch(`${Moonbeam.api ?? ''}/verify-remark`, {
        method: 'POST',
        headers: Moonbeam.apiKey ? { 'x-api-key': Moonbeam.apiKey } : undefined,
        body: JSON.stringify({
          address,
          'extrinsic-hash': extrinsicHash,
          'block-hash': blockHash,
        }),
      })
    ).json()
  ).verified
}
