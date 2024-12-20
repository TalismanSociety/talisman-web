import styled from '@emotion/styled'
import { Text } from '@talismn/ui/atoms/Text'
import { HiddenDetails } from '@talismn/ui/molecules/HiddenDetails'
import { SearchBar } from '@talismn/ui/molecules/SearchBar'
import { useState } from 'react'
import { useDebounce } from 'react-use'

import type { Dapp } from '@/components/legacy/widgets/useFetchDapps'
import { ExploreCard } from '@/components/legacy/widgets/ExploreCard'
import { ExploreCardLoading, ExploreTagLoading } from '@/components/legacy/widgets/ExploreLoading'
import { useFetchDapps } from '@/components/legacy/widgets/useFetchDapps'
import { TitlePortal } from '@/components/molecules/PageHeader'
import { device } from '@/util/breakpoints'

const ExploreGrid = ({ className }: { className?: string }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchQueryDebounced, setSearchQueryDebounced] = useState('')
  useDebounce(() => setSearchQueryDebounced(searchQuery), 250, [searchQuery])
  const { dapps, loading, tags } = useFetchDapps()
  const [selectedTag, setSelectedTag] = useState<string>('All')

  const filteredDapps = dapps?.filter(
    (dapp: Dapp) =>
      dapp.name.toLowerCase().includes(searchQueryDebounced.toLowerCase()) &&
      (dapp.tags.includes(selectedTag) || selectedTag === 'All')
  )

  return (
    <div className={className}>
      {loading ? (
        <>
          <ExploreTagLoading />
          <ExploreCardLoading isLoading={true} />
        </>
      ) : !loading ? (
        // Create a 4 column grid
        <>
          <section
            css={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              gap: '2rem',
              '@media (min-width: 1024px)': {
                flexDirection: 'row-reverse',
                gap: 0,
              },
            }}
          >
            <SearchBar
              placeholder="Search"
              css={{
                width: '100%',
                '@media (min-width: 1024px)': {
                  width: '46.7%',
                  margin: 0,
                },
              }}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <div className="tags">
              {tags.map(tag => (
                <div
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={selectedTag === tag ? 'selected-tag' : ''}
                >
                  {tag}
                </div>
              ))}
            </div>
          </section>

          {filteredDapps.length > 0 ? (
            <div className="grid">
              {filteredDapps.map((dapp, index) => (
                <ExploreCard key={index} dapp={dapp} setSelectedTag={tag => setSelectedTag(tag)} />
              ))}
            </div>
          ) : (
            <HiddenDetails
              overlay={
                <Text.H4>
                  {filteredDapps.length === 0 && dapps.length > 0
                    ? 'Your search returned no results'
                    : 'No Dapps Found'}
                </Text.H4>
              }
              hidden={filteredDapps.length === 0}
            >
              <ExploreCardLoading isLoading={false} />
            </HiddenDetails>
          )}
        </>
      ) : (
        <p>Error</p>
      )}
    </div>
  )
}

const StyledExploreGrid = styled(ExploreGrid)`
  .tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 87vw;
    height: 100%;
    justify-content: flex-start;

    @media ${device.md} {
      width: 100%;
    }

    > div {
      height: 26px;
      font-size: 1.25rem;
      margin: 0.5rem 0.5rem 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      background: var(--color-activeBackground);
      border-radius: 1rem;
      cursor: pointer;
      transition: 0.2s;
    }

    .selected-tag {
      background: var(--talisman-connect-button-foreground);
      color: black;
    }

    > div:hover {
      background: var(--color-dim);
      transition: 0.2s;
    }
  }

  .grid {
    display: grid;

    grid-template-columns: repeat(3, 1fr);

    @media ${device.sm} {
      grid-template-columns: repeat(3, 1fr);
      width: 87vw;
    }

    @media ${device.md} {
      grid-template-columns: repeat(3, 1fr);
      width: 100%;
    }

    @media ${device.lg} {
      grid-template-columns: repeat(12, 1fr);
    }

    grid-gap: 2.5rem;
  }
`

const Explore = styled(({ className }: { className?: string }) => (
  <section className={className}>
    <TitlePortal>Explore</TitlePortal>
    <StyledExploreGrid />
  </section>
))`
  color: var(--color-text);
  width: 100%;
`

export default Explore
