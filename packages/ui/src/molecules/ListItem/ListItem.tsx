import { Text } from '../../atoms'
import { type HTMLMotionProps, motion } from 'framer-motion'
import { type ReactNode } from 'react'

export type ListItemProps = HTMLMotionProps<'article'> & {
  headlineContent: ReactNode
  overlineContent?: ReactNode
  supportingContent?: ReactNode
  leadingContent?: ReactNode
  trailingContent?: ReactNode
  revealTrailingContentOnHover?: boolean
}

export type MotionVariant = 'hover'

const ListItem = ({
  headlineContent,
  overlineContent,
  supportingContent,
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
        {overlineContent && <Text.BodySmall as="div">{overlineContent}</Text.BodySmall>}
        <Text.Body as="div" alpha="high">
          {headlineContent}
        </Text.Body>
        {supportingContent && <Text.BodySmall as="div">{supportingContent}</Text.BodySmall>}
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
