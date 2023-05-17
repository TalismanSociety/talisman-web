import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { type MotionProps, motion } from 'framer-motion'
import { type ReactNode } from 'react'

type Props = {
  title?: string
  subtitle?: string | ReactNode
  className?: string
  children?: ReactNode
  comingSoon?: boolean
} & MotionProps

export const Panel = styled(({ title, subtitle, children, className, ...rest }: Props) => (
  <motion.div className={`panel ${className ?? ''}`} {...rest}>
    {title !== undefined && (
      <h1>
        {title}
        {subtitle !== undefined && <span>{subtitle}</span>}
      </h1>
    )}
    <div className="inner">{children}</div>
  </motion.div>
))`
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
    background: #1b1b1b;
    color: rgb(${({ theme }) => theme.foreground});

    // add a bottom border to every row except the last one
    > .panel-section:not(:last-child) {
      border-bottom: 1px solid rgba(${({ theme }) => theme.foreground}, 0.05);
    }

    .panel-section + .panel-section {
      border-top: 1px solid rgba(${({ theme }) => theme.foreground}, 0.05);
    }
  }
`

export const Section = styled(({ title, children, className, comingSoon, ...rest }: Props) => (
  <motion.div className={`panel-section ${className ?? ''}`} {...rest}>
    {!!title && <h2>{title}</h2>}
    {children}
  </motion.div>
))`
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
