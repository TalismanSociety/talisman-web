import { Card, CardLoading, TagLoading } from '@archetypes/Explore'
import { Dapp, useFetchDapps } from '@archetypes/Explore/hooks'
import styled from '@emotion/styled'
import { device } from '@util/breakpoints'
import { useState } from 'react'

const ExploreGrid = ({ className }: any) => {
  const { dapps, loading, error, tags } = useFetchDapps()
  const [selectedTag, setSelectedTag] = useState<string>('All')

  return (
    <div className={className}>
      {loading ? (
        <>
          <TagLoading />
          <CardLoading />
        </>
      ) : !loading && dapps.length === 0 ? (
        <p>No dapps found</p>
      ) : !loading && dapps.length > 0 ? (
        // Create a 4 column grid
        <>
          <div className="tags">
            {tags.map((tag: string) => (
              <div key={tag} onClick={() => setSelectedTag(tag)} className={selectedTag === tag ? 'selected-tag' : ''}>
                {tag}
              </div>
            ))}
          </div>

          <div className="grid">
            {dapps.map(
              (dapp: Dapp) =>
                (selectedTag === 'All' || dapp.tags.includes(selectedTag)) && (
                  <Card dapp={dapp} setSelectedTag={tag => setSelectedTag(tag)} />
                )
            )}
          </div>
        </>
      ) : (
        <p>{error}</p>
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

    @media ${device.md} {
      width: 100%;
    }

    > div {
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
    margin-bottom: 2rem;
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
  }

`

const Explore = styled(({ className }) => (
  <section className={className}>
    <h1>Explore</h1>
    <StyledExploreGrid />
  </section>
))`
  color: var(--color-text);
  width: 100%;
  max-width: 1280px;
  margin: 3rem auto;
  @media ${device.xl} {
    margin: 6rem auto;
  }
  padding: 0 2.4rem;
`

export default Explore
