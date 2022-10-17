import styled from '@emotion/styled'

type Props = {
  className?: string
  title?: string | null
  subtitle?: string | null
  graphic?: JSX.Element
  rest?: any
}
const Info = styled(({ title, subtitle, graphic, className, ...rest }: Props) => (
  <div className={`info ${className}`} {...rest}>
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
      font-weight: bold;
      color: var(--color-text);
    }

    .subtitle {
      font-size: var(--font-size-small);
      color: var(--color-mid);
    }
  }
`

export default Info
