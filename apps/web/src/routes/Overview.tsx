import OwnPools from '@archetypes/NominationPools/OwnPools'
import useAssets, { useAssetsFiltered } from '@archetypes/Portfolio/Assets'
import Button from '@components/atoms/Button'
// import { ArrowRight } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { Search } from '@components/Field'
import DisplayValue from '@components/molecules/DisplayValue/DisplayValue'
import Asset, { AssetsList, AssetsListLocked } from '@components/recipes/Asset'
import { NFTCard } from '@components/recipes/NFTCard'
import { useState } from 'react'

const Overview = () => {
  const [search, setSearch] = useState('')
  const { fiatTotal } = useAssets()
  const { tokens, balances, isLoading } = useAssetsFiltered({ size: 8, search })

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
            {/* Array of 4 NFT Cards passinng in fake NFT */}
            <NFTCard isBlank />
            <NFTCard isBlank />
            <NFTCard isBlank />
            <NFTCard isBlank />
          </div>
        </section>
        <Button variant="secondary" css={{ width: 'fit-content' }}>
          View all Assets
        </Button>
        <Button
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
      </div>
      <OwnPools />
    </>
  )
}

export default Overview
