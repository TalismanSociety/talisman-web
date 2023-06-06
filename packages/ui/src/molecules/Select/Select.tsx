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
import { ChevronDown, X } from '@talismn/icons'
import { motion } from 'framer-motion'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Surface, Text, useSurfaceColor } from '../../atoms'
import FloatingPortal from '../../atoms/FloatingPortal'

export type SelectProps<TValue extends string | number, TClear extends boolean = false> = {
  value?: TValue
  renderSelected?: (value: TValue | undefined) => ReactNode
  placeholder?: ReactNode
  width?: string | number
  children: ReactElement<SelectItemProps> | Array<ReactElement<SelectItemProps>>
  onChange?: (value: TClear extends false ? TValue : TValue | undefined) => unknown
  clearRequired?: TClear
}

type SelectItemProps = {
  value?: string | number
  leadingIcon?: ReactNode
  headlineText: ReactNode
  supportingText?: ReactNode
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
  <TValue extends string | number, TClear extends boolean = false>({
    width = '100%',
    children,
    renderSelected,
    clearRequired: _clearRequired,
    ...props
  }: SelectProps<TValue, TClear>) => {
    const theme = useTheme()
    const surfaceColor = useSurfaceColor()

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

    const selectedChild =
      renderSelected?.(props.value) ?? (selectedIndex === undefined ? undefined : childrenArray[selectedIndex])

    const clearRequired = !open && _clearRequired && selectedChild !== undefined

    const { context, x, y, reference, floating, strategy } = useFloating({
      open,
      onOpenChange: open => {
        if (clearRequired) {
          // @ts-expect-error
          props.onChange?.(undefined)
        }
        setOpen(open)
      },
      whileElementsMounted: autoUpdate,
      middleware: [
        // TODO: right now only work for bottom overflow
        // which is what we need. Implement support for top overflow later
        size({
          apply: ({ rects, availableHeight, elements }) => {
            // Execute this inside requestAnimationFrame to avoid annoying
            // ResizeObserver loop limit exceeded error
            // https://github.com/floating-ui/floating-ui/issues/1740#issuecomment-1540639488
            requestAnimationFrame(() => {
              Object.assign(elements.floating.style, {
                width: `${rects.reference.width}px`,
                maxHeight: `${availableHeight}px`,
              })
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
      (value: string | number) => {
        setOpen(false)
        setActiveIndex(null)
        // @ts-expect-error
        props.onChange?.(value)
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
      <motion.div
        initial={String(false)}
        animate={String(open)}
        variants={{
          true: { filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.25))' },
          false: { filter: 'drop-shadow(0 0 0 rgba(0, 0, 0, 0.25))' },
        }}
        css={{ width }}
      >
        <Surface
          as={motion.button}
          ref={reference}
          variants={{
            true: {
              border: `solid ${theme.color.border}`,
              borderWidth: '1px 1px 0 1px',
              transitionEnd: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
            },
            false: {
              border: 'solid transparent',
              borderWidth: '1px 1px 0 1px',
              transitionEnd: { borderBottomLeftRadius: '0.8rem', borderBottomRightRadius: '0.8rem' },
            },
          }}
          css={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.6rem',
            textAlign: 'start',
            padding: '0.75rem 1.25rem',
            borderRadius: '0.8rem',
            cursor: 'pointer',
            width: '100%',
          }}
          {...getReferenceProps()}
        >
          <Text.Body as="div" css={{ pointerEvents: 'none', userSelect: 'none', overflow: 'hidden' }}>
            {selectedChild ?? <Text.Body alpha="disabled">{props.placeholder}</Text.Body>}
          </Text.Body>
          {clearRequired ? (
            <X />
          ) : (
            <ChevronDown css={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'ease 0.25s' }} />
          )}
        </Surface>
        <FloatingPortal>
          <motion.ul
            ref={floating}
            variants={{
              true: {
                height: 'unset',
                visibility: 'unset',
                border: `solid ${theme.color.border}`,
                borderWidth: '0 1px 1px 1px',
                transitionEnd: { overflow: 'auto' },
              },
              false: {
                height: 0,
                border: 'solid transparent',
                borderWidth: '0 1px 1px 1px',
                overflow: 'hidden',
                transitionEnd: { visibility: 'hidden' },
              },
            }}
            css={{
              'margin': 0,
              'padding': 0,
              'borderBottomLeftRadius': '0.5rem',
              'borderBottomRightRadius': '0.5rem',
              'backgroundColor': surfaceColor,
              'listStyle': 'none',
              'li': {
                'padding': '1.5rem 1.25rem',
                'backgroundColor': surfaceColor,
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
                backgroundColor: surfaceColor,
              },
            }}
            {...getFloatingProps({
              style: {
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
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
                  if (node !== null) {
                    listRef.current[index] = node
                  }
                }}
                tabIndex={!open ? -1 : index === activeIndex ? 0 : 1}
                aria-selected={index === activeIndex}
                css={{ cursor: 'pointer' }}
                {...getItemProps({
                  onClick: () => {
                    if (child.props.value !== undefined) {
                      select(child.props.value)
                    }
                  },
                  onKeyDown: event => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      if (child.props.value !== undefined) {
                        select(child.props.value)
                      }
                    }
                  },
                })}
              >
                {child}
              </li>
            ))}
          </motion.ul>
        </FloatingPortal>
      </motion.div>
    )
  },
  {
    /**
     * @deprecated
     */
    Item: SelectItem,
    Option: SelectItem,
  }
)

export default Select
