import OwnPools from '@archetypes/NominationPools/OwnPools'
import useAssets, { useAssetsFiltered } from '@archetypes/Portfolio/Assets'
import Button from '@components/atoms/Button'
// import { ArrowRight } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { Search } from '@components/Field'
import DisplayValue from '@components/molecules/DisplayValue/DisplayValue'
import Asset, { AssetsList, AssetsListLocked } from '@components/recipes/Asset'
import { NFTCard } from '@components/recipes/NFTCard'
import { GetNFTData } from '@libs/@talisman-nft'
import { useAccountAddresses, useActiveAccount } from '@libs/talisman'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const Overview = () => {
  const [search, setSearch] = useState('')
  const { fiatTotal } = useAssets()
  const { tokens, balances, isLoading } = useAssetsFiltered({ size: 8, search })

  const { address } = useActiveAccount()
  const addresses = useAccountAddresses()

  // const { items, isFetching, count } = GetNFTData({ addresses: address ? [address] : addresses })

  const nfts = useMemo(() => {
    // Keeps rerendering when items changes for some reason
    // Ask Swami / Tien

    // if(!isFetching && !items.length){
    //   return <Text.Body>No NFTs found</Text.Body>
    // }
    // // if still fetching and the items lenght is less than 4, return the loading cards but only display the remainder of items minus 4
    // if (isFetching && items.length < 4) {
    //   return Array.from({ length: 4 - items.length }).map((_, index) => <NFTCard loading={true} />)
    // }

    // return items.slice(0, 4).map((nft: any) => (
    //   <NFTCard key={nft.id} nft={nft} />
    // ))
    return <></>
  }, [])

  return (
    <>
      <div
        css={{
          // grid 1x2
          'gridTemplateColumns': '1fr',
          'display': 'grid',
          'gap': '1em',
          // mobile
          '@media (min-width: 1024px)': {
            gridTemplateColumns: '1.75fr 1fr',
            gap: '3.2rem 3.2rem',
          },
        }}
      >
        {/* Assets */}
        <section
          css={{
            'display': 'flex',
            'flexDirection': 'column',
            'gap': '3rem',

            // last table
            '> table:last-of-type': {
              'display': 'table',

              '@media (min-width: 1024px)': {
                display: 'none',
              },
            },
          }}
        >
          <div
            css={{
              'display': 'flex',
              'flexDirection': 'column',
              'justifyContent': 'space-between',
              'alignItems': 'center',
              '@media (min-width: 1024px)': {
                flexDirection: 'row',
              },
            }}
          >
            {/* Make this into a component */}
            <Text.H3 css={{ margin: 0 }}>
              Assets{' '}
              <span
                css={{
                  color: '#A5A5A5',
                  fontFamily: 'Surt',
                  marginLeft: '1rem',
                }}
              >
                <DisplayValue amount={fiatTotal} />
              </span>
            </Text.H3>
            <Search
              placeholder="Search"
              css={{
                'marginTop': '2rem',
                'width': '100%',
                '@media (min-width: 1024px)': {
                  margin: 0,
                  width: '35%',
                },
              }}
              value={search}
              onChange={setSearch}
            />
          </div>
          <AssetsList isLoading={isLoading}>
            {tokens &&
              tokens.map((token, i) => <Asset key={token?.tokenDetails?.id} token={token} balances={balances} />)}
          </AssetsList>
          <AssetsListLocked isLoading={isLoading}>
            {/* tokens but filtered by locked */}
            {tokens &&
              tokens
                .filter(token => token.locked)
                .map((token, i) => (
                  <Asset key={token?.tokenDetails?.id} token={token} balances={balances} lockedAsset />
                ))}
          </AssetsListLocked>
        </section>
        {/* NFTs */}
        <section
          css={{
            'display': 'none',
            // mobile
            '@media (min-width: 1024px)': {
              display: 'flex',
              flexDirection: 'column',
              gap: '3rem',
            },
          }}
        >
          {/* 2x2 grid of NFTCards */}
          <Text.H3 css={{ margin: 0 }}>NFTs</Text.H3>
          <div
            css={{
              'display': 'grid',
              'gridTemplateColumns': '1fr',
              'gap': '2rem',
              // mobile
              '@media (min-width: 1024px)': {
                gridTemplateColumns: '1fr 1fr',
              },
            }}
          >
            {nfts}
          </div>
        </section>
        <Link to="assets">
          <Button variant="secondary" css={{ width: 'fit-content' }}>
            View all Assets
          </Button>
        </Link>

        <Link to="nfts">
          <Button
            onClick={() => {}}
            variant="secondary"
            css={{
              'width': 'fit-content',
              'display': 'none',

              // mobile
              '@media (min-width: 1024px)': {
                display: 'block',
              },
            }}
          >
            View all NFTs
          </Button>
        </Link>
      </div>
      <OwnPools />
    </>
  )
}

export default Overview
