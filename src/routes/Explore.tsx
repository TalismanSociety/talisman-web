import { useFetchDapps } from '@archetypes/Explore/hooks'
import { device } from '@util/breakpoints'
import { useState } from 'react'
import styled from 'styled-components'

const ExploreGrid = ({ className }: any) => {

  const { dapps, loading, error, tags } = useFetchDapps()
  const [selectedTag, setSelectedTag] = useState<string>('All')

  return (
    <div className={className}>
      {!!loading ? (
        <div>Searching the Paraverse...</div>
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
              (dapp: any) =>
                (selectedTag === 'All' || dapp.tags.includes(selectedTag)) && (
                  <div className="card" key={dapp.id} onClick={() => (window.location.href = dapp.url)}>
                    <div className="card__header">
                      <img src={dapp.logoUrl} alt={dapp.name + ' logo'} className="logo" />
                      <img src={dapp.logoUrl} alt={dapp.name + ' logo'} className="logoBG" />
                    </div>
                    <div className="card-body">
                      <span>
                        <h3>{dapp.name}</h3>
                        <p>{dapp.description}</p>
                      </span>
                      <span>
                        {!!dapp.tags &&
                          dapp.tags.map((tag: any) => (
                            <span className="tag" key={tag} onClick={(event) => {
                              event.stopPropagation();
                              setSelectedTag(tag)
                            }}>
                              {tag}
                            </span>
                          ))}
                      </span>
                    </div>
                  </div>
                )
            )}
          </div>
        </>
      ) : (
        <p>Error: {error}</p>
      )}
    </div>
  )
}

const StyledExploreGrid = styled(ExploreGrid)`
  .tags {
    display: flex;
    flex-direction: row;
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
    }

    @media ${device.md} {
      grid-template-columns: repeat(6, 1fr);
    }

    @media ${device.lg} {
      grid-template-columns: repeat(12, 1fr);
    }

    grid-gap: 2.5rem;
    .card {
      cursor: pointer;
      background: #1e1e1e;
      border-radius: 1rem;
      border: 1px solid transparent;
      overflow: hidden;
      grid-column: span 3;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: 0.2s;
      .card__header {
        height: 175px;
        overflow: hidden;
        position: relative;
      }
      .logo {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 1.5em;
        z-index: 2;
      }
      .logoBG {
        position: absolute;
        top: 0;
        left: 0;
        filter: blur(50rem) saturate(3);
        z-index: 1;
        height: 100%;
        width: 100%;
      }
      .card-body {
        flex-grow: 2;
        justify-content: space-between;

        display: flex;
        flex-direction: column;

        padding: 2rem;
        h3 {
          font-size: 2rem;
        }
        p {
          font-size: 1.5rem;
          color: var(--color-mid);
        }
        a {
          background: #ffbd00;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          color: #1e1e1e;
          font-weight: bold;
          text-decoration: none;
        }
        .tag {
          font-size: 1rem;
          margin: 0.5rem 0.5rem 0 0;
          display: inline-block;
          padding: 0.5rem 1rem;
          background: var(--color-activeBackground);
          border-radius: 1rem;
          color: var(--color-mid);
        }

        .tag:hover {
          background: var(--color-dim);
        }
      }
      height: 450px;
    }
  }

  .card:hover {
    border: 1px solid rgb(90,90,90);
    transition: 0.2s;
  }

  .card:nth-child(-n + 3) {
    grid-column: span 3;
    @media ${device.lg} {
      grid-column: span 4;
    }
  }
`

const Explore = styled(({ className }) => {
  return (
    <section className={className}>
      <h1>Explore</h1>
      <StyledExploreGrid />
    </section>
  )
})`
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
