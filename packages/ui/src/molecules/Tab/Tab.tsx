import { useTheme } from '@emotion/react'
import { motion } from 'framer-motion'
import { type ElementType, type PropsWithChildren, type ReactElement } from 'react'
import { Text } from '../..'

type TabItemElementType = React.ElementType | ElementType<any>

type PolymorphicTabItemProps<T extends TabItemElementType = 'li'> = PropsWithChildren<{
  as?: T
  selected?: boolean
}>

export type TabItemProps<T extends TabItemElementType = 'button'> = PolymorphicTabItemProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicTabItemProps<T>>

const TabItem = <T extends TabItemElementType = 'li'>({ as = 'li' as T, ...props }: TabItemProps<T>) => {
  const theme = useTheme()
  const Element = as

  return (
    <Element
      {...(props as any)}
      css={{
        position: 'relative',
        padding: '0.8rem 0',
        cursor: 'pointer',
      }}
    >
      <Text.BodyLarge
        color={props.selected ? theme.color.primary : undefined}
        alpha={props.selected ? 'high' : 'medium'}
        css={{ fontSize: '1.8rem', margin: 0 }}
      >
        {props.children}
      </Text.BodyLarge>
      {props.selected && (
        <motion.div
          layoutId="foo"
          css={{ position: 'absolute', right: 0, bottom: -1, left: 0, height: 1, backgroundColor: theme.color.primary }}
        />
      )}
    </Element>
  )
}

export type TabProps = {
  className?: string
  children?: ReactElement | ReactElement[]
}

const Tab = Object.assign(
  (props: TabProps) => {
    const theme = useTheme()
    return (
      <ul
        {...props}
        css={{
          display: 'flex',
          gap: '2.4rem',
          margin: 0,
          borderBottom: `1px solid ${theme.color.border}`,
          padding: 0,
          listStyle: 'none',
        }}
      />
    )
  },
  { Item: TabItem }
)

export default Tab
