import styled from '@emotion/styled'
import { device } from '@util/breakpoints'

export const TagLoading = styled(({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <div>Talisman is the coolest 🍜. The explore page will help you find all the Dapps/Daos and Applications.</div>
    </div>
  )
})`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 87vw;
  margin-bottom: 2rem;

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
    border-radius: 1rem;
    cursor: pointer;
    transition: 0.2s;
    color: transparent;

    animation: shimmer 1s infinite;
    background: linear-gradient(90deg, rgba(30, 30, 30, 1) 4%, rgba(60, 60, 60, 1) 25%, rgba(30, 30, 30, 1) 36%);
    background-size: 4000px 100%;
  }

  @keyframes shimmer {
    0% {
      background-position: -600px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`

export const CardLoading = styled(({ className, isLoading }: { className?: string; isLoading?: boolean }) => {
  return (
    <div className={className}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} isLoading={isLoading} />
      ))}
    </div>
  )
})`
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
`

const Card = styled(({ className }: { className?: string; isLoading?: boolean }) => {
  return (
    <div className={className}>
      <div className="card-header" />
      <div className="card-body" />
    </div>
  )
})`
  cursor: pointer;
  background: #1e1e1e;
  border-radius: 1rem;
  overflow: hidden;
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.2s;

  .card-body {
    flex-grow: 2;
    justify-content: space-between;

    display: flex;
    flex-direction: column;

    animation: ${props => (props.isLoading ? 'shimmer 1s infinite' : 'none')};
    background: ${props =>
      props.isLoading
        ? 'linear-gradient(90deg, rgba(30, 30, 30, 1) 4%, rgba(60, 60, 60, 1) 25%, rgba(30, 30, 30, 1) 36%)'
        : '#1e1e1e'};
    background-size: 2000px 100%;

    padding: 2rem;
  }

  .card-header {
    height: 175px;
    overflow: hidden;
    position: relative;

    animation: ${props => (props.isLoading ? 'shimmer 1s infinite' : 'none')};
    background: ${props =>
      props.isLoading
        ? 'linear-gradient(90deg, rgba(24, 24, 24, 1) 4%, rgba(50, 50, 50, 1) 25%, rgba(24, 24, 24, 1) 36%);'
        : '#222'};
    background-size: 2000px 100%;
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 400px 0;
    }
  }

  height: 450px;

  :nth-child(-n + 3) {
    grid-column: span 3;
    @media ${device.lg} {
      grid-column: span 4;
    }
  }
`
