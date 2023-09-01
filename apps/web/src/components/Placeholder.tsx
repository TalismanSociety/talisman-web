import styled from '@emotion/styled'
import { device } from '@util/breakpoints'

type PlaceholderProps = {
  className?: string
  children: React.ReactNode
  placeholder?: string
  placeholderImage?: string
}

export const Placeholder = styled(({ className, children }: PlaceholderProps) => {
  return (
    <div className={className}>
      <div className="info">{children}</div>
    </div>
  )
})`
  text-align: center;
  background-image: url(${props => props.placeholderImage});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  padding: 14rem 4rem;

  @media ${device.lg} {
    padding: 14rem;
  }

  .info > * + * {
    margin-top: 2rem;
  }

  .info .description {
    color: var(--color-foreground);
  }
`
