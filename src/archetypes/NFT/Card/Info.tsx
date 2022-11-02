import styled from '@emotion/styled'

type InfoProps = {
  title: string
  subtitle: string
  className?: string
}

const Info = styled(({ title, subtitle, className, ...rest }: InfoProps) => (
  <div className={className} {...rest}>
    <span className="text">
      {!!subtitle && <span className="subtitle">{subtitle}</span>}
      {!!title && <span className="title">{title}</span>}
    </span>
  </div>
))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: inherit;
  position: relative;
  width: 80%;

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
      // max-width: calc(100% - 3rem);
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
