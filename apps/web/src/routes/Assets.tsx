import useAssets, { useAssetsFiltered } from '@archetypes/Portfolio/Assets'
import { Total } from '@archetypes/Wallet'
import { Search } from '@components/Field'
import Asset, { AssetsList, AssetsListLocked } from '@components/recipes/Asset'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import styled from '@emotion/styled'
import { ChevronLeft } from '@talismn/icons'
import { Button, InfoCard } from '@talismn/ui'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Assets = () => {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const { tokens, balances, isLoading } = useAssetsFiltered({ size: undefined, search })
  const { lockedTotal } = useAssets()

  return (
    <AssetPage>
      {/* Upper Section */}
      <Button variant="secondary" leadingIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
        Back
      </Button>
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
          <InfoCard headlineText={'Total Portfolio Value'} text={<Total />} minWidth={'150px'} />
          <InfoCard headlineText={'Locked Value'} text={<AnimatedFiatNumber end={lockedTotal} />} minWidth={'150px'} />
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
          {tokens?.map(token => (
            <Asset key={token?.tokenDetails?.id} token={token} balances={balances} />
          ))}
        </AssetsList>
        <AssetsListLocked isLoading={isLoading}>
          {/* tokens but filtered by locked */}
          {tokens
            ?.filter(token => token.locked)
            ?.map(token => (
              <Asset key={token?.tokenDetails?.id} token={token} balances={balances} lockedAsset />
            ))}
        </AssetsListLocked>
      </section>
    </AssetPage>
  )
}

const AssetPage = styled.section`
  width: 100%;
  > header + article {
    margin-top: 3rem;
  }
`

export default Assets
