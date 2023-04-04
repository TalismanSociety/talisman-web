import { type ReactNode } from 'react'

import { Text } from '../../atoms'

export type InfoWithHeaderProps = {
  header: ReactNode
  content: ReactNode
}

const InfoWithHeader = (props: InfoWithHeaderProps) => {
  return (
    <article css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 'fit-content' }}>
      <Text.Body
        css={{
          marginBottom: '.25em',
          fontSize: '1em',
          maxWidth: '400px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {props.header}
      </Text.Body>
      {props.content}
    </article>
  )
}

export default InfoWithHeader
