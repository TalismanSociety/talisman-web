import styled from 'styled-components'

const Info = styled(({ title, subtitle, graphic, className, ...rest }) => (
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
