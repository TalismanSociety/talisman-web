import { useTheme } from '@emotion/react'
import {
  autoPlacement,
  autoUpdate,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
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
  className?: string
  value?: TValue
  renderSelected?: (value: TValue | undefined) => ReactNode
  placeholder?: ReactNode
  children?: ReactNode
  onChange?: (value: TClear extends false ? TValue : TValue | undefined) => unknown
  clearRequired?: TClear
  detached?: boolean
}

type SelectItemProps = {
  value?: string | number
  leadingIcon?: ReactNode
  headlineText: ReactNode
  supportingText?: ReactNode
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>((props, ref) => (
  <div ref={ref} css={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    {props.leadingIcon && (
      <figure css={{ display: 'flex', alignItems: 'center', maxWidth: 40, maxHeight: 40, margin: 0 }}>
        {props.leadingIcon}
      </figure>
    )}
    <div>
      <Text.Body as="div">{props.headlineText}</Text.Body>
      <Text.Body as="div">{props.supportingText}</Text.Body>
    </div>
  </div>
))

const Select = Object.assign(
  <TValue extends string | number, TClear extends boolean = false>({
    children,
    renderSelected,
    clearRequired: _clearRequired,
    detached,
    ...props
  }: SelectProps<TValue, TClear>) => {
    const theme = useTheme()
    const surfaceColor = useSurfaceColor()

    const listRef = useRef<HTMLLIElement[]>([])
    const listContentRef = useRef<Array<string | null>>([])
    const [open, setOpen] = useState(false)
    const [pointer, setPointer] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const childrenArray = React.Children.toArray(children)

    const selectedIndex = childrenArray
      .filter((x): x is ReactElement<SelectItemProps> => x as any)
      .findIndex(x => x.props.value?.toString() === props.value?.toString())

    const selectedChild =
      renderSelected?.(props.value) ?? (selectedIndex === undefined ? undefined : childrenArray[selectedIndex])

    const clearRequired = !open && _clearRequired && selectedChild !== undefined

    // slight overlap for better border radius animation
    const overlap = detached ? 0 : 6

    const { context, x, y, refs, strategy } = useFloating({
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
                maxHeight: `${availableHeight}px`,
              })

              if (!detached) {
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
                })
              }
            })
          },
        }),
        offset(detached ? 6 : -overlap),
        ...(detached
          ? [autoPlacement({ allowedPlacements: ['top-start', 'top-end', 'bottom-start', 'bottom-end'] })]
          : []),
      ],
    })

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      useRole(context, { role: 'listbox' }),
      useClick(context),
      useListNavigation(context, {
        listRef,
        activeIndex,
        // TODO: disable selected index for now as
        // as this cause weird animation on open if an item is already focused
        // selectedIndex,
        onNavigate: setActiveIndex,
        loop: true,
      }),
      useTypeahead(context, {
        listRef: listContentRef,
        activeIndex,
        onMatch: setActiveIndex,
      }),
      useDismiss(context),
    ])

    const select = useCallback(
      (value: string | number | undefined) => {
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
        className={props.className}
        initial={String(false)}
        animate={String(open)}
        variants={{
          true: { filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.25))' },
          false: { filter: 'drop-shadow(0 0 0 rgba(0, 0, 0, 0.25))' },
        }}
        css={{ display: 'inline-block' }}
      >
        <Surface
          as={motion.button}
          ref={refs.setReference}
          variants={{
            true: {
              border: `solid ${theme.color.border}`,
              borderWidth: '1px 1px 0 1px',
              transitionEnd: {
                borderBottomLeftRadius: detached ? '0.8rem' : 0,
                borderBottomRightRadius: detached ? '0.8rem' : 0,
              },
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
          <Text.Body as="div" css={{ pointerEvents: 'none', userSelect: 'none' }}>
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
            ref={refs.setFloating}
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
            css={[
              {
                'margin': 0,
                'padding': 0,
                'backgroundColor': surfaceColor,
                'listStyle': 'none',
                'li': {
                  'padding': '1.5rem 1.25rem',
                  'backgroundColor': surfaceColor,
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
                  height: overlap,
                  backgroundColor: surfaceColor,
                },
              },
              detached
                ? { borderRadius: '0.5rem' }
                : { borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' },
            ]}
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
            {React.Children.map(children as any, (child: ReactElement<SelectItemProps>, index) => (
              <li
                key={child.key}
                role="option"
                ref={node => {
                  if (node !== null) {
                    listRef.current[index] = node
                    listContentRef.current[index] = node?.textContent
                  }
                }}
                tabIndex={index === activeIndex ? 0 : 1}
                aria-selected={index === selectedIndex && index === activeIndex}
                css={[{ cursor: 'pointer' }, index === activeIndex && { filter: 'brightness(1.2)' }]}
                {...getItemProps({
                  onClick: () => select(child.props.value),
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
