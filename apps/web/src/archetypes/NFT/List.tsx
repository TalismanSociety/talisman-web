import { CopyButton } from '@components/CopyButton'
import { NFTCard } from '@components/recipes/NFTCard'
import { legacySelectedAccountState, selectedAccountsState } from '@domains/accounts/recoils'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { nftDataState } from '@libs/@talisman-nft/provider'
import { NFTShort } from '@libs/@talisman-nft/types'
import { Copy } from '@talismn/icons'
import { Identicon, Text } from '@talismn/ui'
import { device } from '@util/breakpoints'
import toast from 'react-hot-toast'
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

  if (isFetching && items.length === 0)
    return (
      <ListGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <NFTCard key={index} loading />
        ))}
      </ListGrid>
    )

  if (items.length === 0 && !isFetching && !count)
    return (
      <HiddenNFTGrid
        overlay={
          <span
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              > * {
                margin-bottom: 1rem;
              }
            `}
          >
            <Text.H2>No NFTs Found</Text.H2>
            <Text.Body>Please try another account</Text.Body>
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
                  toast(
                    <>
                      <Text.Body as="div" alpha="high">
                        Address copied to clipboard
                      </Text.Body>
                      <Text.Body as="div">{text}</Text.Body>
                    </>,
                    { position: 'bottom-right', icon: <Copy /> }
                  )
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
