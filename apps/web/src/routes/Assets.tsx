import useAssets, { useAssetsFiltered } from '@archetypes/Portfolio/Assets'
import { Search } from '@components/Field'
import DisplayValue from '@components/molecules/DisplayValue/DisplayValue'
import InfoCard from '@components/molecules/InfoCard'
import Asset, { AssetsList, AssetsListLocked } from '@components/recipes/Asset'
import styled from '@emotion/styled'
import { useState } from 'react'

const Assets = () => {
  const [search, setSearch] = useState('')
  const { tokens, balances, isLoading } = useAssetsFiltered({ size: 0, search })
  const { fiatTotal, lockedTotal } = useAssets()

  return (
    <AssetPage>
      {/* Upper Section */}
      <section
        css={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '2rem',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <Search value={search} onChange={setSearch} placeholder="Search for an Asset" />
        <div
          css={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          <InfoCard
            headlineText={'Total Portfolio Value'}
            text={<DisplayValue amount={fiatTotal} />}
            minWidth={'150px'}
          />
          <InfoCard headlineText={'Locked Value'} text={<DisplayValue amount={lockedTotal} />} minWidth={'150px'} />
        </div>
      </section>
      {/* Lower Section */}
      <section
        css={{
          'display': 'flex',
          'flexDirection': 'column',
          'gap': '3rem',

          // only show the last table on mobile
          '> table:last-of-type': {
            'display': 'table',

            '@media (min-width: 1024px)': {
              display: 'none',
            },
          },
        }}
      >
        <AssetsList isLoading={isLoading}>
          {tokens &&
            tokens.map((token, i) => <Asset key={token?.tokenDetails?.id} token={token} balances={balances} />)}
        </AssetsList>
        <AssetsListLocked isLoading={isLoading}>
          {/* tokens but filtered by locked */}
          {tokens &&
            tokens
              .filter(token => token.locked)
              .map((token, i) => <Asset key={token?.tokenDetails?.id} token={token} balances={balances} lockedAsset />)}
        </AssetsListLocked>
      </section>
    </AssetPage>
  )
}

const AssetPage = styled.section`
  width: 100%;
  max-width: 1280px;
  padding: 0 2.4rem;
  > header + article {
    margin-top: 3rem;
  }
`

export default Assets
