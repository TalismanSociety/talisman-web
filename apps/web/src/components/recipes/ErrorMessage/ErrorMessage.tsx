import { Text } from '@talismn/ui'
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'
import TalismanHand from './TalismanHand'

export type ErrorMessageProps = {
  title: ReactNode
  message: ReactNode
  actions: ReactNode
  orientation?: 'vertical' | 'horizontal'
}

const ErrorMessage = Object.assign(
  (props: ErrorMessageProps) => (
    <article
      css={[
        { display: 'flex', alignItems: 'center', gap: '1.6rem' },
        props.orientation === 'horizontal' ? {} : { flexDirection: 'column', textAlign: 'center' },
      ]}
    >
      <figure css={{ margin: 0 }}>
        <TalismanHand width="12rem" height="12rem" />
      </figure>
      <div
        css={[
          { display: 'flex', flexDirection: 'column' },
          props.orientation === 'horizontal' ? { gap: '0.8rem' } : { alignItems: 'center', gap: '1.6rem' },
        ]}
      >
        <Text.H4 as="header">{props.title}</Text.H4>
        <Text.Body>{props.message}</Text.Body>
        {props.actions}
      </div>
    </article>
  ),
  {
    Actions: (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
      <div {...props} css={{ display: 'flex', gap: '0.8rem' }} />
    ),
  }
)

export default ErrorMessage
