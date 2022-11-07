import Text from '@components/atoms/Text'
import { ReactNode } from 'react'

export type PillProps = {
  header: ReactNode
  content: ReactNode
}

const Pill = (props: PillProps) => {
  return (
    <article
      css={{
        'display': 'flex',
        'flexDirection': 'column',
        'alignItems': 'flex-start',
        'justifyContent': 'center',
        'padding': '.5em',
        'borderRadius': '.5em',
        'backgroundColor': '#262626',
        'color': '#fff',
        'width': 'fit-content',
        'maxWidth': '200px',
        '> *': {
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width: '100%',
        },
      }}
    >
      <Text.Body css={{ fontSize: '12px', marginBottom: '.25em', color: '#A5A5A5' }}>{props.header}</Text.Body>
      {props.content}
    </article>
  )
}

export default Pill
