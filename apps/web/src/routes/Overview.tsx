import OwnPools from '@archetypes/NominationPools/OwnPools'
import useAssets, { useAssetsFiltered } from '@archetypes/Portfolio/Assets'
import { Crowdloans } from '@archetypes/Wallet'
import { Search } from '@components/Field'
import Asset, { AssetsList, AssetsListLocked } from '@components/recipes/Asset'
import { NFTCard } from '@components/recipes/NFTCard'
import { selectedAccountsState } from '@domains/accounts/recoils'
import { filteredNftDataState } from '@libs/@talisman-nft/provider'
import { NFTShort } from '@libs/@talisman-nft/types'
import { Button, DisplayValue, HiddenDetails, Text } from '@talismn/ui'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

const Overview = () => {
  const [search, setSearch] = useState('')
  const { fiatTotal } = useAssets()
  const { tokens, balances, isLoading } = useAssetsFiltered({ size: 8, search })

  const selectedAccounts = useRecoilValue(selectedAccountsState)
  const { items, isFetching } = useRecoilValue(filteredNftDataState)

  const nfts = useMemo(() => {
    const filteredItems = items.filter(x => selectedAccounts.map(x => x.address).includes(x.address))

    if (!isFetching && filteredItems.length === 0) {
      return Array.from({ length: 4 }).map((_, index) => <NFTCard key={index} isBlank />)
    }
    // if still fetching and the items lenght is less than 4, return the loading cards but only display the remainder of items minus 4

    if (!isFetching && filteredItems.length !== 0) {
      return filteredItems.slice(0, 4).map((nft: NFTShort) => <NFTCard key={nft.id} nft={nft} />)
    }

    // return Array of size 4 with loading cards
    return Array.from({ length: 2 }).map((_, index) => <NFTCard key={index} loading />)

    // return <></>
  }, [isFetching, items, selectedAccounts])

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
            gridTemplateColumns: '2.15fr 1fr',
            gap: '2rem 3.2rem',
            marginBottom: '2rem',
          },
        }}
      >
        {/* Assets */}
        <section
          css={{
            'display': 'flex',
            'flexDirection': 'column',
            'gap': '1.8rem',

            // last table
            '> table:last-of-type': {
              'display': 'table',

              '@media (min-width: 1024px)': {
                display: 'none',
                height: '620px',
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
            {tokens?.map((token, i) => (
              <Asset key={token?.tokenDetails?.id} token={token} balances={balances} />
            ))}
          </AssetsList>
          <AssetsListLocked isLoading={isLoading}>
            {/* tokens but filtered by locked */}
            {tokens
              ?.filter(token => token.locked)
              ?.map((token, i) => (
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
              gap: '4.45rem',
            },
          }}
        >
          {/* 2x2 grid of NFTCards */}
          <div
            css={{
              display: 'flex',
              height: '41px',
              alignItems: 'center',
            }}
          >
            <Text.H3 css={{ margin: 0 }}>NFTs</Text.H3>
          </div>
          <HiddenDetails overlay={<Text.H3>No NFTs Found</Text.H3>} hidden={!isFetching && items.length === 0}>
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
          </HiddenDetails>
        </section>
        {tokens.length >= 8 && !isLoading ? (
          <Button variant="secondary" css={{ width: 'fit-content' }} as={Link} to="assets">
            View all assets
          </Button>
        ) : (
          <div />
        )}
        {items.length > 4 ? (
          <Button
            as={Link}
            variant="secondary"
            css={{
              'width': 'fit-content',
              'display': 'none',

              // mobile
              '@media (min-width: 1024px)': {
                display: 'block',
              },
            }}
            to="nfts"
          >
            View all NFTs
          </Button>
        ) : (
          <div />
        )}
      </div>
      <Crowdloans />
      <OwnPools />
    </>
  )
}

export default Overview
