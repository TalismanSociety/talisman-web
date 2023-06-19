import { type ApiPromise } from '@polkadot/api'
import { u8aToString } from '@polkadot/util'
import { partition, range } from '@thi.ng/iterators'
import Psp34 from '../../../generated/ink/contracts/psp34.js'
import { type Id as ArgumentId } from '../../../generated/ink/types-arguments/psp34.js'
import { type Id } from '../../../generated/ink/types-returns/psp34.js'
import type { CreateNftAsyncGenerator, Nft } from '../../types.js'

const stringFromId = (id: Id) => {
  if (id.bytes !== undefined) {
    // Generated type is wrong here, bytes can also be a string
    return typeof id.bytes === 'string' ? id.bytes : u8aToString(new Uint8Array(id.bytes))
  }

  if (id.u128 !== undefined) {
    return id.u128.rawNumber.toString()
  }

  if (id.u16 !== undefined) {
    return id.u16.toString()
  }

  if (id.u32 !== undefined) {
    return id.u32.toString()
  }

  if (id.u64 !== undefined) {
    return id.u64.toString()
  }

  if (id.u8 !== undefined) {
    return id.u8.toString()
  }

  throw new Error(`Invalid ID: ${JSON.stringify(id)}`)
}

const returnIdToArgumentId = (id: Id): ArgumentId => ({ ...id, u128: id.u128?.rawNumber })

export const createPsp34NftsAsyncGenerator: <T extends string>(options: {
  chainId: T
  api: ApiPromise
  contractAddresses: string[]
  getExternalLink: (contractAddress: string) => Array<{ name: string; url: string }>
}) => CreateNftAsyncGenerator<Nft<'psp34', T>> = ({ chainId, api, contractAddresses, getExternalLink }) =>
  async function* (address, { batchSize }) {
    const contracts = contractAddresses.map(contractAddress => {
      return new Psp34(contractAddress, {} as any, api)
    })

    const contractBalances = await Promise.all(
      contracts.map(async x => [x, await x.query.balanceOf(address).then(x => x.value.ok)] as const)
    )

    const contractsWithNonZeroBalance = contractBalances.filter((x): x is [(typeof x)[0], number] => (x[1] ?? 0) > 0)

    for (const [contract, balance] of contractsWithNonZeroBalance) {
      for (const tokenIndexes of partition(batchSize, batchSize, range(0, balance), true)) {
        yield* await Promise.all(
          tokenIndexes.map(async tokenIndex => {
            const [tokenIdResult, collectionIdResult, totalSupplyResult] = await Promise.all([
              contract.query.ownersTokenByIndex(address, tokenIndex),
              contract.query.collectionId(),
              contract.query.totalSupply(),
            ])

            const tokenId = tokenIdResult.value.unwrap().unwrap()
            const collectionId = collectionIdResult.value.unwrap()
            const totalSupply = totalSupplyResult.value.unwrap()

            const [collectionNameResult, tokenNameResult] = await Promise.all([
              contract.query.getAttribute(returnIdToArgumentId(collectionId), 'name'),
              contract.query.getAttribute(returnIdToArgumentId(tokenId), 'name'),
            ])

            const collectionName = collectionNameResult.value.ok ?? undefined
            const tokenName = tokenNameResult.value.ok ?? undefined

            const type = 'psp34' as const

            return {
              type,
              chain: chainId,
              id: `${type}-${chainId}-${stringFromId(collectionId)}-${stringFromId(tokenId)}`,
              name: tokenName,
              description: undefined,
              media: undefined,
              thumbnail: undefined,
              serialNumber: BigInt(stringFromId(tokenId)),
              properties: undefined,
              externalLinks: getExternalLink(contract.address),
              collection: {
                id: stringFromId(collectionId),
                name: collectionName,
                totalSupply: BigInt(totalSupply.rawNumber.toString()),
              },
            }
          })
        )
      }
    }
  }
