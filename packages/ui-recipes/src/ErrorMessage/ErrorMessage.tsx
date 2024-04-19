import { Text } from '@talismn/ui'
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'
import TalismanHand from './TalismanHand'

export type ErrorMessageProps = {
  title: ReactNode
  message: ReactNode
  actions?: ReactNode
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
        <TalismanHand
          width={props.orientation === 'horizontal' ? '6rem' : '10rem'}
          height={props.orientation === 'horizontal' ? '6rem' : '10rem'}
        />
      </figure>
      <div
        css={[
          { display: 'flex', flexDirection: 'column' },
          props.orientation === 'horizontal'
            ? { flexDirection: 'row', gap: '0.8rem' }
            : { alignItems: 'center', gap: '1.6rem' },
        ]}
      >
        <div>
          <Text.BodyLarge as="header" alpha="high">
            {props.title}
          </Text.BodyLarge>
          <Text.BodySmall>{props.message}</Text.BodySmall>
        </div>
        {props.actions}
      </div>
    </article>
  ),
  {
    Actions: (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
      <div {...props} css={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }} />
    ),
  }
)

export default ErrorMessage
