import { ChevronDown } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import useOnClickOutside from '@util/useOnClickOutside'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useRef } from 'react'
import { MouseEventHandler, ReactElement, ReactNode, useCallback, useState } from 'react'

export type SelectProps = {
  width?: string | number
  children: ReactElement<SelectItemProps> | ReactElement<SelectItemProps>[]
}

type SelectItemProps = {
  selected?: boolean
  leadingIcon: ReactNode
  headlineText: ReactNode
  supportingText: ReactNode
  onClick?: MouseEventHandler
}

const SelectItem = (props: SelectItemProps) => (
  <div css={{ display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={props.onClick}>
    <figure css={{ maxWidth: 40, maxHeight: 40, margin: 0 }}>{props.leadingIcon}</figure>
    <div>
      <div>
        <Text>{props.headlineText}</Text>
      </div>
      <div>
        <Text>{props.supportingText}</Text>
      </div>
    </div>
  </div>
)

const Select = Object.assign(
  ({ width = '30rem', children }: SelectProps) => {
    const theme = useTheme()
    const containerRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)

    const selectedChild = React.Children.toArray(children)
      .filter((x): x is ReactElement<SelectItemProps> => x as any)
      .find(x => x.props.selected)

    useOnClickOutside(containerRef, () => setOpen(false))

    return (
      <div
        ref={containerRef}
        css={[
          {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            backgroundColor: theme.color.foreground,
            padding: '0.75rem 1.25rem',
            borderRadius: '0.8rem',
            cursor: 'pointer',
            width: width,
          },
          open && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
        ]}
        onClick={useCallback(() => setOpen(x => !x), [])}
      >
        <div css={{ pointerEvents: 'none', userSelect: 'none' }}>{selectedChild ?? <Text>Select account</Text>}</div>
        <ChevronDown css={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'ease 0.25s' }} />
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ height: 0 }}
              animate={{ height: 'unset' }}
              exit={{ height: 0 }}
              css={{
                width,
                'position': 'absolute',
                'zIndex': 1,
                // slight overlap for better border radius animation
                'top': '95%',
                'left': 0,
                'margin': 0,
                'padding': 0,
                'borderBottomLeftRadius': '0.5rem',
                'borderBottomRightRadius': '0.5rem',
                'backgroundColor': theme.color.foreground,
                'listStyle': 'none',
                'overflow': 'hidden',
                'li > *': {
                  'margin': '0.5rem 0',
                  'padding': '1rem 1.25rem',
                  'backgroundColor': theme.color.foreground,
                  ':hover': {
                    filter: 'brightness(1.2)',
                  },
                  ':last-child': {
                    margin: '0.5rem 0 0 0',
                  },
                },
              }}
            >
              {React.Children.map(children, child => (
                <li key={child.key}>{child}</li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    )
  },
  { Item: SelectItem }
)

export default Select
