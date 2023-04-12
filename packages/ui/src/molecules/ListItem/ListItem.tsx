import { type HTMLMotionProps, motion } from 'framer-motion'
import { type ReactNode } from 'react'

import { Text } from '../../atoms'

export type ListItemProps = HTMLMotionProps<'article'> & {
  headlineText: ReactNode
  overlineText?: ReactNode
  supportingText?: ReactNode
  leadingContent?: ReactNode
  trailingContent?: ReactNode
  revealTrailingContentOnHover?: boolean
}

export type MotionVariant = 'hover'

const ListItem = ({
  headlineText,
  overlineText,
  supportingText,
  leadingContent,
  trailingContent,
  ...props
}: ListItemProps) => {
  return (
    <motion.article
      animate="initial"
      whileHover="hover"
      {...props}
      css={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.3rem 1.6rem' }}
    >
      {leadingContent && (
        <div css={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>{leadingContent}</div>
      )}
      <header css={{ flex: 1, overflow: 'hidden' }}>
        {overlineText && <Text.Body as="div">{overlineText}</Text.Body>}
        <Text.Body as="div" alpha="high">
          {headlineText}
        </Text.Body>
        {supportingText && <Text.Body as="div">{supportingText}</Text.Body>}
      </header>
      {trailingContent && (
        <motion.div
          variants={{
            initial: { opacity: props.revealTrailingContentOnHover ? 0 : 1, transition: { duration: 0 } },
            hover: { opacity: 1 },
          }}
          css={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}
        >
          {trailingContent}
        </motion.div>
      )}
    </motion.article>
  )
}

export default ListItem
