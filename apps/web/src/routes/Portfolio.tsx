import Text from '@components/atoms/Text'
import { Search } from '@components/Field'
import { AccountValueInfo } from '@components/molecules/AccountValueInfo'
import { BottomBorderNav } from '@components/molecules/BottomBorderNav'
import Asset, { AssetsList } from '@components/recipes/Asset'
import { NFTCard } from '@components/recipes/NFTCard'

const Overview = () => {
  return (
    <div
      css={{
        // grid 1x2
        'gridTemplateColumns': '1fr',
        'display': 'grid',
        // mobile
        '@media (min-width: 1024px)': {
          gridTemplateColumns: '2fr 1fr',
          gap: '3.2rem',
        },
      }}
    >
      {/* Assets */}
      <section
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
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
              $69,300.16
            </span>
          </Text.H3>
          <Search
            placeholder="Search"
            css={{
              'marginTop': '2rem',
              'width': '100%',
              '@media (min-width: 1024px)': {
                margin: 0,
                width: '25vw',
              },
            }}
          />
        </div>
        <AssetsList>
          <Asset />
          <Asset />
          <Asset />
          <Asset />
          <Asset />
          <Asset />
          <Asset />
        </AssetsList>
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
    </div>
  )
}

const Portfolio = () => {
  return (
    <div
      css={{
        'display': 'flex',
        'flexDirection': 'column',
        'gap': '5rem',
        'width': '100%',
        'maxWidth': '1280px',
        'margin': '3rem auto',
        '@media (min-width: 1024px)': {
          margin: '3rem auto',
        },
        'padding': '0 2.4rem',
      }}
    >
      <AccountValueInfo address={''} name={'All Accounts'} balance={'$356,120.32'} />
      <BottomBorderNav
        items={[
          {
            labelValue: 'Overview',
            path: '',
          },
          {
            labelValue: 'NFTs',
            path: '',
          },
          {
            labelValue: 'Assets',
            path: '',
          },
          {
            labelValue: 'History',
            path: '',
          },
        ]}
      >
        <Overview />
      </BottomBorderNav>
    </div>
  )
}

export default Portfolio
