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
      const collectionIdPromise = contract.query.collectionId()
      const totalSupplyPromise = contract.query.totalSupply()
      const collectionNamePromise = collectionIdPromise.then(idResult =>
        contract.query.getAttribute(returnIdToArgumentId(idResult.value.unwrap()), 'name')
      )

      // NOTE: Paras & ArtZero fuckery
      // need to remove support for both when better PSP34 collections are available
      const baseUriPromise = Promise.all([
        collectionIdPromise.then(idResult =>
          contract.query.getAttribute(returnIdToArgumentId(idResult.value.unwrap()), 'baseUri')
        ),
        contract.query.getAttribute(returnIdToArgumentId({ u8: 0 }), 'baseURI'),
      ]).then(
        ([collectionBaseUrl, madeUpZeroIdCollectionBaseUri]) =>
          collectionBaseUrl.value.ok ?? madeUpZeroIdCollectionBaseUri.value.ok
      )

      for (const tokenIndexes of partition(batchSize, batchSize, range(0, balance), true)) {
        yield* await Promise.all(
          tokenIndexes.map(async tokenIndex => {
            const tokenIdResult = await contract.query.ownersTokenByIndex(address, tokenIndex)
            const tokenId = tokenIdResult.value.unwrap().unwrap()

            const tokenNameResult = await contract.query.getAttribute(returnIdToArgumentId(tokenId), 'name')
            const tokenName = tokenNameResult.value.ok ?? undefined

            const [collectionId, totalSupply, collectionName, baseUri] = await Promise.all([
              collectionIdPromise.then(x => x.value.unwrap()),
              totalSupplyPromise.then(x => x.value.unwrap()),
              collectionNamePromise.then(x => x.value.ok),
              baseUriPromise,
            ])

            const metadata = !baseUri
              ? undefined
              : await fetch(
                  new URL(
                    'ipfs/' +
                      baseUri.replace('ipfs://', '').replaceAll('ipfs', '').replaceAll('/', '') +
                      `/${stringFromId(tokenId)}.json`,
                    'https://talisman.mypinata.cloud'
                  )
                )
                  .then(x => x.json())
                  .catch(() => undefined)

            const type = 'psp34' as const

            return {
              type,
              chain: chainId,
              id: `${type}-${chainId}-${stringFromId(collectionId)}-${stringFromId(tokenId)}`,
              name: tokenName || metadata?.name,
              description: metadata?.description,
              media: metadata?.image,
              thumbnail: metadata?.image,
              serialNumber: BigInt(stringFromId(tokenId)),
              properties: undefined,
              externalLinks: getExternalLink(contract.address),
              collection: {
                id: stringFromId(collectionId),
                name: collectionName ?? undefined,
                totalSupply: BigInt(totalSupply.rawNumber.toString()),
              },
            }
          })
        )
      }
    }
  }
