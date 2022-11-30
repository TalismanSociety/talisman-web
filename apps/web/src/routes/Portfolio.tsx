import OwnPools from '@archetypes/NominationPools/OwnPools'
import useAssets from '@archetypes/Portfolio/Assets'
import Button from '@components/atoms/Button'
// import { ArrowRight } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { Search } from '@components/Field'
import { AccountValueInfo } from '@components/molecules/AccountValueInfo'
import { BottomBorderNav } from '@components/molecules/BottomBorderNav'
import Asset, { AssetsList, AssetsListLocked } from '@components/recipes/Asset'
import { NFTCard } from '@components/recipes/NFTCard'
import { useActiveAccount } from '@libs/talisman'
import { Outlet } from 'react-router'
import { Link, useMatch } from 'react-router-dom'

const testTokens = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    imgUrl: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    fiatBalance: 500,
    planckBalance: BigInt(500),
    locked: true,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    imgUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    fiatBalance: 900,
    planckBalance: BigInt(321123500),
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    imgUrl: 'https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860',
    fiatBalance: 100,
    planckBalance: BigInt(500),
  },
  {
    name: 'Polkadot',
    symbol: 'DOT',
    imgUrl: 'https://assets.coingecko.com/coins/images/12171/large/aJGBjJFU_400x400.jpg?1597804776',
    fiatBalance: 100,
    planckBalance: BigInt(500),
  },
  {
    name: 'Uniswap',
    symbol: 'UNI',
    imgUrl: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png?1600306604',
    fiatBalance: 100,
    planckBalance: BigInt(500),
  },
  {
    name: 'Chainlink',
    symbol: 'LINK',
    imgUrl: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1547034700',
    fiatBalance: 100,
    planckBalance: BigInt(500),
  },
]

export const Overview = () => {
  const { address } = useActiveAccount()
  const { assetBalances, fiatTotal, balances } = useAssets()

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
                {fiatTotal}
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
            />
          </div>
          <AssetsList>
            {assetBalances.slice().map(token => (
              <Asset key={token.id} token={token} balances={balances} address={address} />
            ))}
          </AssetsList>
          <AssetsListLocked>
            <Asset token={testTokens[0]} />
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

const Portfolio = () => {
  // useMatch
  const paths = [
    { path: '', name: 'Overview' },
    { path: 'nfts', name: 'NFTs' },
    { path: 'history', name: 'History' },
  ]

  const { fiatTotal } = useAssets()
  const account = useActiveAccount()

  const currentPath = useMatch('/portfolio/:id')?.params.id ?? paths[0]?.path

  return (
    <div
      css={{
        'display': 'flex',
        'flexDirection': 'column',
        'gap': '2rem',
        'width': '100%',
        'maxWidth': '1280px',
        'margin': '3rem auto',
        '@media (min-width: 1024px)': {
          margin: '3rem auto',
        },
        'padding': '0 2.4rem',
      }}
    >
      <AccountValueInfo address={account?.address} name={account?.name ?? 'All Accounts'} balance={fiatTotal} />
      <BottomBorderNav>
        {paths.map(path => (
          <BottomBorderNav.Item key={path.path} selected={path.path === currentPath}>
            <Link to={path.path}>{path.name}</Link>
          </BottomBorderNav.Item>
        ))}
      </BottomBorderNav>
      <Outlet context={{}} />
    </div>
  )
}

export default Portfolio
