import styled from '@emotion/styled'

import Info from './Info'
import Preview from './Preview'

interface CardProps {
  className?: string
}

function LoadingCard({ className }: CardProps) {
  const loadingnft = {
    id: '0x0000000000000000000000000000000000000000000000000000000000000000',
    name: 'Loading...',
    provider: 'Loading...',
    type: 'loading',
  }

  return (
    <div className={className}>
      <Preview nft={loadingnft} />
      <div className="information">
        <Info subtitle={loadingnft.provider} title={loadingnft.name} />
        <span></span>
      </div>
    </div>
  )
}

const StyledLoadingCard = styled(LoadingCard)`
  overflow: hidden;
  border-radius: 1rem;
  background-color: #262626;
  cursor: pointer;

  .information {
    display: flex;
    justify-content: space-between;
  }

  > * {
    width: 100%;
  }

  .information > div > span > span {
    background-color: var(--color-activeBackground);
    border-radius: 0.5rem;
    padding: 0 !important;

    color: transparent !important;

    &:first-child {
      width: 80% !important;
    }

    &:last-child {
      margin-top: 5px;
    }
  }

  span {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  > div {
    margin: 1rem 0;
  }
`

export default StyledLoadingCard
