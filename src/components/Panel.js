import styled from 'styled-components'

const PanelSection = styled(
  ({
    title,
    children,
    className,
    ...rest
  }) => {
    return <article
      className={`panel-section ${className}`}
      >
      {!!title && <h2>{title}</h2>}
      {children}
    </article>
  })
  `
    padding: 2.1rem 0;
    h2{
      font-size: var(--font-size-xsmall);
      font-weight: bold;
      color: var(--color-mid);
      margin-bottom: 1.4em;
    }
  `

const Panel = styled(
  ({
    title,
    children,
    className,
    ...rest
  }) => 
    <section
      className={`panel ${className}`}
      {...rest}
      >
      {!!title && <h1>{title}</h1>}
      <div
        className="inner"
        >
        {children}
      </div>
    </section>
  )
  `
    >h1{
      margin-bottom: 0.6em;
      font-size: var(--font-size-normal)
    }

    >.inner{
      padding: 2.2rem 2.4rem;
      display: block;
      border-radius: 1.6rem;
      user-select: none;
      background: rgb(${({theme}) => theme.background});
      color: rgb(${({theme}) => theme.foreground});
      box-shadow: 0px 0px 2.4rem rgba(${({theme}) => theme.foreground}, 0.1);

      .panel-section:first-child{
        padding-top: 0;
      }

      .panel-section:last-child{
        padding-bottom: 0;
      }

      .panel-section + .panel-section{
        border-top: 1px solid rgba(${({theme}) => theme.foreground}, 0.1);
      }
    }
  `

Panel.Section = PanelSection

export default Panel