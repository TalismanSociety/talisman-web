import { useTheme } from '@emotion/react'
import {
  autoUpdate,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react'
import { ChevronDown } from '@talismn/icons'
import { motion } from 'framer-motion'
import React, {
  ReactElement,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { Text } from '../../atoms'

type Value = string | number | undefined

export type SelectProps = {
  value?: Value
  placeholder?: ReactNode
  width?: string | number
  children: ReactElement<SelectItemProps> | ReactElement<SelectItemProps>[]
  onChange?: (value: string | undefined) => unknown
}

type SelectItemProps = {
  value?: Value
  leadingIcon: ReactNode
  headlineText: ReactNode
  supportingText: ReactNode
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>((props, ref) => (
  <div ref={ref} css={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <figure css={{ maxWidth: 40, maxHeight: 40, margin: 0 }}>{props.leadingIcon}</figure>
    <div>
      <div>
        <Text.Body>{props.headlineText}</Text.Body>
      </div>
      <div>
        <Text.Body>{props.supportingText}</Text.Body>
      </div>
    </div>
  </div>
))

// slight overlap for better border radius animation
const OVERLAP = 6

const Select = Object.assign(
  ({ width = '30rem', children, ...props }: SelectProps) => {
    const theme = useTheme()
    const listRef = useRef<HTMLLIElement[]>([])
    const [open, setOpen] = useState(false)
    const [pointer, setPointer] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const childrenArray = React.Children.toArray(children)

    const selectedIndex =
      props.value === undefined
        ? undefined
        : childrenArray
            .filter((x): x is ReactElement<SelectItemProps> => x as any)
            .findIndex(x => x.props.value !== undefined && x.props.value.toString() === props.value?.toString())

    const selectedChild = selectedIndex === undefined ? undefined : childrenArray[selectedIndex]

    const { context, x, y, reference, floating, strategy } = useFloating({
      open,
      onOpenChange: setOpen,
      whileElementsMounted: autoUpdate,
      middleware: [
        // TODO: right now only work for bottom overflow
        // which is what we need. Implement support for top overflow later
        size({
          apply: ({ rects, availableHeight, elements }) => {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              maxHeight: `${availableHeight}px`,
            })
          },
        }),
        offset(-OVERLAP),
      ],
    })

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      useRole(context, { role: 'listbox' }),
      useClick(context),
      useListNavigation(context, {
        // TODO: this caused element to jump a little
        // so disabling for now, need to investigate further
        enabled: false,
        listRef,
        activeIndex,
        selectedIndex,
        onNavigate: setActiveIndex,
        loop: true,
      }),
      useDismiss(context),
    ])

    const select = useCallback(
      (value: Value) => {
        setOpen(false)
        setActiveIndex(null)
        props.onChange?.(value?.toString())
      },
      [props]
    )

    useEffect(() => {
      if (!open && pointer) {
        setPointer(false)
      }
    }, [open, pointer])

    useLayoutEffect(() => {
      if (open && activeIndex !== null && !pointer) {
        requestAnimationFrame(() => {
          listRef.current[activeIndex]?.scrollIntoView({
            block: 'nearest',
          })
        })
      }
    }, [open, activeIndex, pointer])

    return (
      <motion.div initial={String(false)} animate={String(open)}>
        <motion.button
          ref={reference}
          variants={{
            true: { transitionEnd: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } },
            false: { transitionEnd: { borderBottomLeftRadius: '0.8rem', borderBottomRightRadius: '0.8rem' } },
          }}
          css={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            textAlign: 'start',
            backgroundColor: theme.color.foreground,
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderRadius: '0.8rem',
            cursor: 'pointer',
            width: width,
          }}
          {...getReferenceProps()}
        >
          <Text.Body as="div" css={{ pointerEvents: 'none', userSelect: 'none' }}>
            {selectedChild ?? props.placeholder}
          </Text.Body>
          <ChevronDown css={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'ease 0.25s' }} />
        </motion.button>
        <motion.ul
          ref={floating}
          variants={{
            true: { height: 'unset', display: 'block', transitionEnd: { overflow: 'auto' } },
            false: { height: 0, overflow: 'hidden', transitionEnd: { display: 'none' } },
          }}
          css={{
            'margin': 0,
            'padding': 0,
            'borderBottomLeftRadius': '0.5rem',
            'borderBottomRightRadius': '0.5rem',
            'backgroundColor': theme.color.foreground,
            'listStyle': 'none',
            'li': {
              'padding': '1.5rem 1.25rem',
              'backgroundColor': theme.color.foreground,
              ':hover': {
                filter: 'brightness(1.2)',
              },
              ':focus-visible': {
                filter: 'brightness(1.2)',
              },
              ':last-child': {
                padding: '1.5rem 1.25rem 1rem 1.25rem',
              },
            },
            // Top spacer for animation overlap
            '::before': {
              content: '""',
              display: 'block',
              position: 'sticky',
              top: 0,
              height: OVERLAP,
              backgroundColor: theme.color.foreground,
              zIndex: 1,
            },
          }}
          {...getFloatingProps({
            style: {
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
              zIndex: 1,
            },
            onPointerMove: () => {
              setPointer(true)
            },
            onKeyDown: event => {
              setPointer(false)

              if (event.key === 'Tab') {
                setOpen(false)
              }
            },
          })}
        >
          {React.Children.map(children, (child, index) => (
            <li
              key={child.key}
              role="option"
              ref={node => {
                listRef.current[index] = node!
              }}
              tabIndex={!open ? -1 : index === activeIndex ? 0 : 1}
              aria-selected={index === activeIndex}
              css={{ cursor: 'pointer' }}
              {...getItemProps({
                onClick: () => select(child.props.value),
                onKeyDown: event => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    select(child.props.value)
                  }
                },
              })}
            >
              {child}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    )
  },
  { Item: SelectItem }
)

export default Select
