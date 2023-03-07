import OwnPools from '@archetypes/NominationPools/OwnPools'
import useAssets, { useAssetsFiltered } from '@archetypes/Portfolio/Assets'
import { Crowdloans } from '@archetypes/Wallet'
import { Search } from '@components/Field'
import Asset, { AssetsList, AssetsListLocked } from '@components/recipes/Asset'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import { Button, Text } from '@talismn/ui'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const AssetsOverview = () => {
  const [search, setSearch] = useState('')
  const { fiatTotal } = useAssets()
  const { tokens, balances, isLoading } = useAssetsFiltered({ size: 8, search })

  return (
    <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1.6rem' }}>
      <section
        css={{
          'width': '100%',
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
              <AnimatedFiatNumber end={fiatTotal} />
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
      {tokens.length >= 8 && !isLoading ? (
        <Button variant="secondary" css={{ width: 'fit-content' }} as={Link} to="assets">
          View all assets
        </Button>
      ) : (
        <div />
      )}
    </div>
  )
}

const Overview = () => (
  <div
    css={{
      'display': 'grid',
      '@media(min-width: 1024px)': {
        gridTemplateColumns: '1fr 1fr',
        gap: '2.3rem',
      },
    }}
  >
    <AssetsOverview />
    <div css={{ display: 'grid', gap: '4.8rem' }}>
      <OwnPools />
      <Crowdloans />
    </div>
  </div>
)

export default Overview
