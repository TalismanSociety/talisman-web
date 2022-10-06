import { css } from '@emotion/react'
import styled from '@emotion/styled'

type BasePanelProps = {
  title: string
  subtitle: string
  className: string
  rest: any[]
}

export const Section = styled(({ title, children, className, comingSoon, ...rest }) => {
  return (
    <div className={`panel-section ${className}`} {...rest}>
      {!!title && <h2>{title}</h2>}
      {children}
    </div>
  )
})<BasePanelProps>`
  display: block;
  padding: 1.55rem 2rem;

  h2 {
    font-size: var(--font-size-xsmall);
    font-weight: bold;
    color: var(--color-mid);
    margin-bottom: 1.4em;
  }

  ${props =>
    props.comingSoon &&
    css`
      padding: 6rem 2rem;
      color: var(--color-mid);
      text-align: center;
    `}
`

export default styled(({ title, subtitle, children, className, ...rest }) => {
  // const listInnerRef : any = useRef();

  // const [atBottom, setAtBottom] = useState<Boolean>(false);

  // const onScroll = () => {
  //   if (listInnerRef.current) {
  //     const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
  //     if (scrollTop + clientHeight === scrollHeight) {
  //       setAtBottom(true);
  //     }
  //     else {
  //       setAtBottom(false);
  //     }
  //   }
  // };

  return (
    <div className={`panel ${className}`} {...rest}>
      {title !== undefined && (
        <h1>
          {title}
          {subtitle !== undefined && <span>{subtitle}</span>}
        </h1>
      )}
      <div className="inner">{children}</div>
    </div>
  )
})<BasePanelProps>`
  width: 100%;

  > h1 {
    display: flex;
    align-items: baseline;
    margin-bottom: 0.8em;
    font-size: var(--font-size-large);
    font-weight: bold;
    color: var(--color-text);

    > span {
      font-size: var(--font-size-normal);
      margin-left: 0.85em;
      color: var(--color-primary);
      font-weight: normal;
    }
  }

  > .inner {
    display: block;
    border-radius: 1.6rem;
    user-select: none;
    background: rgb(${({ theme }) => theme.controlBackground});
    color: rgb(${({ theme }) => theme.foreground});

    .panel-section + .panel-section {
      border-top: 1px solid rgba(${({ theme }) => theme.foreground}, 0.05);
    }
  }
`
