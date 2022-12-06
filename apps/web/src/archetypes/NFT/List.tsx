import { Copy } from '@components/atoms/Icon'
import Identicon from '@components/atoms/Identicon'
import Text from '@components/atoms/Text'
import { CopyButton } from '@components/CopyButton'
import { NFTCard } from '@components/recipes/NFTCard'
import { WalletNavConnector } from '@components/WalletNavConnector'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { GetNFTData } from '@libs/@talisman-nft'
import { NFTShort } from '@libs/@talisman-nft/types'
import { useAccounts } from '@libs/talisman'
import { device } from '@util/breakpoints'
import toast from 'react-hot-toast'

import HiddenNFTGrid from './HiddenNFTGrid'

type ListItemProps = {
  nfts: NFTShort[]
  isFetching: boolean
}

const ListItems = ({ nfts, isFetching }: ListItemProps) => {
  return (
    <>
      {nfts.map((nft: any) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}

      {/* {nfts.length !== count &&
        Array.from({ length: count - nfts.length }).map((_, index) => <NFTCard loading={true} />)} */}

      {isFetching && <NFTCard loading={true} />}
    </>
  )
}

const ListGrid = styled.div`
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

const List = ({ addresses }: { addresses: string[] }) => {
  const { items, isFetching, count } = GetNFTData({ addresses: addresses })

  const accounts = useAccounts()

  if (!items.length && !isFetching && !count)
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
            <WalletNavConnector />
          </span>
        }
      />
    )

  // filter items by address and map listgrid per address
  const nfts = items.reduce((acc: any, nft: any) => {
    if (!acc[nft?.address]) acc[nft?.address] = []
    acc[nft?.address].push(nft)
    return acc
  }, {})

  // find account name whhere address matches
  const accountName = (address: string) => {
    const account = accounts.find(account => account.address === address)
    return account?.name
  }

  if (Object.keys(nfts).length > 1)
    return (
      <>
        {Object.keys(nfts).map((address: string) => (
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
                {accountName(address)}
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
              <ListItems nfts={nfts[address]} isFetching={isFetching} />
            </ListGrid>
          </>
        ))}
      </>
    )

  return (
    <ListGrid>
      <ListItems nfts={items} isFetching={isFetching} />
    </ListGrid>
  )
}

export default List
