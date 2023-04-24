import { Account, selectedAccountsState } from '@domains/accounts'
import {
  createAcalaNftAsyncGenerator,
  createEvmNftAsyncGenerator,
  createRmrk1NftAsyncGenerator,
  createRmrk2NftAsyncGenerator,
  createStatemineNftAsyncGenerator,
} from '@talismn/nft'
import { DefaultValue, atomFamily, useRecoilValue } from 'recoil'

const nftsState = atomFamily<any[], string>({
  key: 'Nfts',
  default: [],
  effects: (address: string) => [
    ({ setSelf }) => {
      ;(address.startsWith('0x')
        ? [createEvmNftAsyncGenerator]
        : [
            createStatemineNftAsyncGenerator,
            createRmrk2NftAsyncGenerator,
            createRmrk1NftAsyncGenerator,
            createAcalaNftAsyncGenerator,
          ]
      ).map(async createNftAsyncGenerator => {
        for await (const nft of createNftAsyncGenerator(address, { batchSize: 25 })) {
          console.debug(nft)
          setSelf(self => [...(self instanceof DefaultValue ? [] : self), nft])
        }
      })
    },
  ],
})

const AccountNfts = (props: { account: Account }) => {
  const nfts = useRecoilValue(nftsState(props.account.address))

  return (
    <div>
      {nfts.map((nft, index) => (
        <code>{JSON.stringify(nft)}</code>
      ))}
    </div>
  )
}

const Nfts = () => {
  const accounts = useRecoilValue(selectedAccountsState)

  return (
    <section>
      {accounts.map(account => (
        <AccountNfts key={account.address} account={account} />
      ))}
    </section>
  )
}

export default Nfts
