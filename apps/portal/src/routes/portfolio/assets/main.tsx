import useAssets, { useAssetsFiltered } from '../../../components/legacy/archetypes/Portfolio/Assets'
import { Total } from '../../../components/legacy/archetypes/Wallet'
import Asset, { AssetsList, AssetsListLocked } from '../../../components/recipes/Asset'
import AnimatedFiatNumber from '../../../components/widgets/AnimatedFiatNumber'
import { ClassNames } from '@emotion/react'
import styled from '@emotion/styled'
import { Button, InfoCard, SearchBar } from '@talismn/ui'
import { ChevronLeft } from '@talismn/web-icons'
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
        <ClassNames>
          {({ css }) => (
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search for an Asset"
              containerClassName={css({ flex: 1, maxWidth: '37rem' })}
              css={{ width: '100%' }}
            />
          )}
        </ClassNames>
        <div
          css={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          <InfoCard overlineContent={'Total Portfolio Value'} headlineContent={<Total />} css={{ minWidth: '15rem' }} />
          <InfoCard
            overlineContent={'Locked Value'}
            headlineContent={<AnimatedFiatNumber end={lockedTotal} />}
            css={{ minWidth: '15rem' }}
          />
        </div>
      </section>
      {/* Lower Section */}
      <section
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',

          // only show the last table on mobile
          '> table:last-of-type': {
            display: 'table',

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
