import { ChevronDown } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import {
  autoUpdate,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react-dom-interactions'
import { motion } from 'framer-motion'
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

type Value = string | number | undefined

export type SelectProps = {
  value?: Value
  placeholder?: ReactNode
  children: ReactElement<SelectItemProps> | ReactElement<SelectItemProps>[]
  onChange?: (value: string | undefined) => unknown
  variant?: 'default' | 'toggle-no-background'
}

type LabelProps = {
  children: [ReactNode, ReactElement<SelectProps>]
}

type SelectItemProps = PropsWithChildren<{
  value?: Value
  bottomBordered?: boolean
}>

const Label = (props: LabelProps) => (
  <label
    css={{ display: 'flex', alignItems: 'center', gap: '2rem' }}
    onClick={useCallback<MouseEventHandler<HTMLLabelElement>>(event => event.preventDefault(), [])}
  >
    <Text.Body alpha="high">{props.children[0]}</Text.Body>
    {props.children[1]}
  </label>
)

const SelectItem = forwardRef<HTMLSpanElement, SelectItemProps>((props, ref) => (
  <span ref={ref}>
    <Text.Body>{props.children}</Text.Body>
  </span>
))

const Select = Object.assign(
  ({ children, ...props }: SelectProps) => {
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

    const { context, y, reference, floating, strategy } = useFloating({
      open,
      onOpenChange: setOpen,
      whileElementsMounted: autoUpdate,
      middleware: [
        // TODO: right now only work for bottom overflow
        // which is what we need. Implement support for top overflow later
        size({
          apply: ({ rects, availableHeight, elements }) => {
            Object.assign(elements.floating.style, {
              minWidth: `${rects.reference.width}px`,
              maxHeight: `${availableHeight}px`,
            })
          },
        }),
        shift(),
        offset(8),
      ],
    })

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      useRole(context, { role: 'listbox' }),
      useClick(context),
      useListNavigation(context, {
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
            true: {},
            false: {},
          }}
          css={[
            {
              'position': 'relative',
              'display': 'flex',
              'alignItems': 'center',
              'justifyContent': 'space-between',
              'gap': '2rem',
              'textAlign': 'start',
              'backgroundColor': theme.color.surface,
              'padding': '1.6rem',
              'border': 'none',
              'borderRadius': '1.2rem',
              'cursor': 'pointer',
              ':hover': {
                filter: 'brightness(1.2)',
              },
            },
            props.variant === 'toggle-no-background' && { background: 'transparent', padding: '0.6rem' },
          ]}
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
            true: { opacity: 1, display: 'initial', transition: { duration: 0 } },
            false: { opacity: 0, transitionEnd: { display: 'none' } },
          }}
          css={{
            margin: 0,
            padding: 0,
            borderRadius: '1.2rem',
            backgroundColor: theme.color.surface,
            listStyle: 'none',
            overflow: 'auto',
            li: {
              'padding': '1.2rem',
              'backgroundColor': theme.color.surface,
              ':hover': {
                filter: 'brightness(1.2)',
              },
              ':focus-visible': {
                filter: 'brightness(1.2)',
              },
            },
          }}
          {...getFloatingProps({
            style: {
              position: strategy,
              top: y ?? 0,
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
              css={[
                { cursor: 'pointer' },
                child.props.bottomBordered &&
                  index < React.Children.count(children) - 1 && {
                    borderBottom: `solid 1px ${theme.color.foregroundVariant}`,
                  },
              ]}
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
  { Label, Item: SelectItem }
)

export default Select
