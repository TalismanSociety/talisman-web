import OwnPools from '@archetypes/NominationPools/OwnPools'
import useAssets, { useAssetsFiltered } from '@archetypes/Portfolio/Assets'
import { Crowdloans } from '@archetypes/Wallet'
import { Search } from '@components/Field'
import SectionHeader from '@components/molecules/SectionHeader'
import Asset, { AssetsList, AssetsListLocked } from '@components/recipes/Asset'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import PortfolioAllocationGraph from '@components/widgets/PortfolioAllocationGraph'
import { Button } from '@talismn/ui'
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
            'alignItems': 'stretch',
            '@media (min-width: 1024px)': {
              flexDirection: 'row',
              alignItems: 'center',
            },
          }}
        >
          {/* Make this into a component */}
          <SectionHeader
            headlineText="Assets"
            supportingText={<AnimatedFiatNumber end={fiatTotal} />}
            css={{ marginBottom: 0 }}
          />
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
      'display': 'flex',
      'flexDirection': 'column',
      'gap': '2.3rem',
      '@media(min-width: 1024px)': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      },
    }}
  >
    <AssetsOverview />
    <div css={{ display: 'flex', flexDirection: 'column', gap: '4.8rem' }}>
      <PortfolioAllocationGraph />
      <OwnPools />
      <Crowdloans />
    </div>
  </div>
)

export default Overview
