import { CopyButton } from '@components/CopyButton'
import { NFTCard } from '@components/recipes/NFTCard'
import { legacySelectedAccountState, selectedAccountsState } from '@domains/accounts/recoils'
import { copyAddressToClipboard } from '@domains/common/utils'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { nftDataState } from '@libs/@talisman-nft/provider'
import { NFTShort } from '@libs/@talisman-nft/types'
import { ExternalLink } from '@talismn/icons'
import { Identicon, Text } from '@talismn/ui'
import { device } from '@util/breakpoints'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import HiddenNFTGrid from './HiddenNFTGrid'

type ListItemProps = {
  nfts: NFTShort[]
  isFetching: boolean
  count: number
}

const ListItems = ({ nfts, isFetching, count }: ListItemProps) => {
  return (
    <>
      {/* based on the count, compare the number of nfts, and whether is fetching, then show loading cards, based on the difference */}
      {count > nfts.length && isFetching && (
        <>
          {Array.from({ length: count - nfts.length }).map((_, index) => (
            <NFTCard key={index} loading />
          ))}
        </>
      )}

      {nfts && nfts.map((nft: any) => <NFTCard key={nft.id} nft={nft} />)}

      {isFetching && <NFTCard loading />}
    </>
  )
}

export const ListGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  @media ${device.md} {
    grid-template-columns: repeat(2, 1fr);
  }
  @media ${device.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
  @media ${device.xl} {
    grid-template-columns: repeat(4, 1fr);
  }
`

type AccType = {
  [key: string]: NFTShort[]
}

const List = () => {
  const { items, isFetching, count } = useRecoilValue(nftDataState)

  const address = useRecoilValue(legacySelectedAccountState)?.address
  const accounts = useRecoilValue(selectedAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const hasNoNfts = useMemo(
    () =>
      !isFetching &&
      Object.entries(count)
        .filter(x => addresses.includes(x[0]))
        .every(([_, value]) => value === 0),
    [addresses, count, isFetching]
  )

  if (isFetching && items.length === 0)
    return (
      <ListGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <NFTCard key={index} loading />
        ))}
      </ListGrid>
    )

  if (hasNoNfts)
    return (
      <HiddenNFTGrid
        overlay={
          <span
            css={css`
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 0.8rem;
              > * {
                margin-bottom: 1rem;
              }
            `}
          >
            <Text.H2>No collectibles found</Text.H2>
            <Text.Body>
              Talisman currently supports RMRK 2, Astar,
              <br />
              Moonriver, Moonbeam, Statemine and Acala NFTs
            </Text.Body>
            <Text.Body>
              Start your collection with a{' '}
              <Text.Body.A href="https://singular.rmrk.app/collections/b6e98494bff52d3b1e-SPIRIT" target="_blank">
                Spirit Key <ExternalLink size="1em" />
              </Text.Body.A>
            </Text.Body>
          </span>
        }
      />
    )

  // filter items by address and order based on accounts
  const nfts = accounts.reduce((acc: any, account: any) => {
    const nfts = items.filter((nft: any) => nft?.address === account.address)
    if (nfts.length) acc[account.address] = nfts
    return acc
  }, {} as AccType)

  // turn nfts into array of objects and put the account name per address
  const nftsArray = Object.keys(nfts).map((address: string) => {
    return {
      address,
      name: accounts.find(account => account.address === address)?.name,
      nfts: nfts[address] ?? [],
    }
  })

  // sort nftsArray by accounts address order
  nftsArray.sort((a, b) => {
    const aIndex = accounts.findIndex(account => account.address === a.address)
    const bIndex = accounts.findIndex(account => account.address === b.address)
    return aIndex - bIndex
  })

  if (address === undefined)
    return (
      <>
        {nftsArray.map(({ address, name, nfts }) => (
          <>
            <div
              css={{
                'display': 'flex',
                'flexDirection': 'row',
                'alignItems': 'center',

                // first item no top margin
                '&:first-of-type': {
                  marginTop: 0,
                },

                'margin': '3rem 0',
                'gap': '1rem',
              }}
            >
              <Identicon
                value={address}
                css={{
                  width: '4rem',
                  height: '4rem',
                }}
              />
              <Text.Body
                css={{
                  fontSize: '2rem',
                }}
              >
                {name}
              </Text.Body>
              <CopyButton
                text={address}
                onCopied={(text: string) => {
                  copyAddressToClipboard(text)
                }}
                onFailed={(text: string) => {
                  console.log(`>>> failed`, text)
                }}
              />
            </div>
            <ListGrid>
              <ListItems nfts={nfts} isFetching={isFetching} count={count[address]!!} />
            </ListGrid>
          </>
        ))}
      </>
    )

  return (
    <ListGrid>
      <ListItems nfts={nfts[address] ?? []} isFetching={isFetching} count={count[address]!!} />
    </ListGrid>
  )
}

export default List
