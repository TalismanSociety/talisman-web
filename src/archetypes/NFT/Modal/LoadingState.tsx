import styled from '@emotion/styled'

export const LoadingState = () => {
  return (
    <LoadingTiles>
      <span className="title" />
      {/* Array of 4 span with className description */}
      {[...Array(5)].map((_, i) => (
        <span key={i} className="description" />
      ))}
    </LoadingTiles>
  )
}

const LoadingTiles = styled.div`
  padding: 0 2em;
  display: flex;
  flex-direction: column;

  > span {
    font-size: 24px;
    border-radius: 0.5rem;
  }

  > .title,
  .description {
    background-color: var(--color-activeBackground);
    -webkit-mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/300% 100%;
    animation: shimmer 1s infinite;
  }

  @keyframes shimmer {
    100% {
      -webkit-mask-position: left;
    }
  }

  .title + .description {
    margin-top: 1.5em;
  }

  .description {
    margin-top: 0.5em;
    font-size: 16px;
    height: 1em;
  }

  // second last description
  .description:nth-last-child(2) {
    width: 50%;
  }

  .description:last-child {
    margin-top: auto;
    height: 2em;
    width: 100%;
  }

  .title {
    width: 40%;
    height: 2em;
  }
`
