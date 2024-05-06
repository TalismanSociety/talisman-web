import styled from '@emotion/styled'

type Props = {
  className?: string
  title?: React.ReactNode | string | null
  subtitle?: React.ReactNode | string | null
  graphic?: React.ReactNode
  invert?: boolean
  rest?: any
}
const Info = styled(({ title, subtitle, invert, graphic, className, ...rest }: Props) => (
  <div className={`info ${invert ? 'style-invert' : ''} ${className ?? ''}`} {...rest}>
    {graphic && <span className="graphic">{graphic}</span>}
    <span className="text">
      {!!title && <span className="title">{title}</span>}
      {!!subtitle && <span className="subtitle">{subtitle}</span>}
    </span>
  </div>
))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: inherit;

  .graphic {
    margin-right: 0.5em;
    border-radius: 100px;
  }

  .text {
    margin-left: 1rem;

    > * {
      display: block;
      line-height: 1.3em;
    }

    .title {
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .subtitle {
      font-size: var(--font-size-small);
      color: var(--color-mid);
    }
  }

  &.style-invert .text {
    .title {
      font-weight: var(--font-weight-regular);
      font-size: var(--font-size-small);
      color: var(--color-mid);
    }

    .subtitle {
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-normal);
      color: var(--color-text);
    }
  }
`

export default Info
