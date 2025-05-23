import type { ElementType, PropsWithChildren } from 'react'
import { useTheme } from '@emotion/react'
import { motion } from 'framer-motion'
import { createContext, useContext } from 'react'

import { Text } from '../atoms/Text'

const TabsContext = createContext({ noBottomBorder: false })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TabElementType = React.ElementType | ElementType<any>

type PolymorphicTabProps<T extends TabElementType = 'li'> = PropsWithChildren<{
  as?: T
  selected?: boolean
}>

export type TabProps<T extends TabElementType = 'button'> = PolymorphicTabProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicTabProps<T>>

const Tab = <T extends TabElementType = 'li'>({ as = 'li' as T, ...props }: TabProps<T>) => {
  const theme = useTheme()
  const Element = as
  const { noBottomBorder } = useContext(TabsContext)

  return (
    <Element
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
      css={{
        position: 'relative',
        padding: '0.8rem 1.2rem',
        cursor: 'pointer',
      }}
    >
      <Text.BodyLarge
        alpha={props.selected ? 'high' : 'medium'}
        css={{ fontSize: '1.8rem', margin: 0 }}
        style={{ color: props.selected ? theme.color.primary : undefined }}
      >
        {props.children}
      </Text.BodyLarge>
      {!noBottomBorder && props.selected && (
        <motion.div
          layoutId="foo"
          css={{ position: 'absolute', right: 0, bottom: -1, left: 0, height: 1, backgroundColor: theme.color.primary }}
        />
      )}
    </Element>
  )
}

export type TabsProps = PropsWithChildren<{
  className?: string
  noBottomBorder?: boolean
}>

export const Tabs = Object.assign(
  ({ noBottomBorder, ...props }: TabsProps) => {
    const theme = useTheme()
    return (
      <ul
        {...props}
        css={{
          display: 'flex',
          margin: 0,
          borderBottom: noBottomBorder ? undefined : `1px solid ${theme.color.outlineVariant}`,
          padding: 0,
          listStyle: 'none',
        }}
      >
        <TabsContext.Provider value={{ noBottomBorder: noBottomBorder === true }}>
          {props.children}
        </TabsContext.Provider>
      </ul>
    )
  },
  { Item: Tab }
)
