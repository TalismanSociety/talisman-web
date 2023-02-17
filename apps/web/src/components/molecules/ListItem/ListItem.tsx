import Text from '@components/atoms/Text'
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'

export type ListItemProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  headlineText: ReactNode
  overlineText?: ReactNode
  supportingText?: ReactNode
  leadingContent?: ReactNode
  trailingContent?: ReactNode
}

const ListItem = ({
  headlineText,
  overlineText,
  supportingText,
  leadingContent,
  trailingContent,
  ...props
}: ListItemProps) => {
  return (
    <article {...props} css={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.3rem 1.6rem' }}>
      {leadingContent && (
        <div css={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>{leadingContent}</div>
      )}
      <header css={{ flex: 1 }}>
        {overlineText && <Text.Body as="div">{overlineText}</Text.Body>}
        <Text.Body as="div">{headlineText}</Text.Body>
        {supportingText && <Text.Body as="div">{supportingText}</Text.Body>}
      </header>
      {trailingContent && (
        <div css={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>{trailingContent}</div>
      )}
    </article>
  )
}

export default ListItem
