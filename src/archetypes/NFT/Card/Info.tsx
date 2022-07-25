import styled from 'styled-components'

const Info = styled(({ title, subtitle, icon, className, ...rest }) => (
  <div className={className} {...rest}>
    <span className="text">
      {!!subtitle && <span className="subtitle">{subtitle}</span>}
      {!!title && <span className="title">{title}</span>}
    </span>
    {icon && <span className="icon">{icon}</span>}
  </div>
))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: inherit;
  position: relative;

  .icon {
    position: absolute;
    top: 0.5rem;
    right: 1.25rem;
  }

  .text {
    padding-left: 1rem;
    width: 100%;
    display: block;

    .title,
    .subtitle {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      max-width: calc(100% - 3rem);
    }

    > * {
      display: block;
      line-height: 1.3em;
    }

    .title {
      font-weight: bold;
      color: var(--color-text);
      padding-top: 0.5rem;
    }

    .subtitle {
      font-size: var(--font-size-small);
      color: var(--color-mid);
    }
  }
`

export default Info
