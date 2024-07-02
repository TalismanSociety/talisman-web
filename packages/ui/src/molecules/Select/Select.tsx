import { CircularProgressIndicator, Surface, Text, useSurfaceColor } from '../../atoms'
import FloatingPortal from '../../atoms/FloatingPortal'
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
} from '@floating-ui/react'
import { ChevronDown, X } from '@talismn/web-icons'
import { motion } from 'framer-motion'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'

export type SelectProps<TValue, TClear extends boolean = false> = {
  className?: string
  value?: TValue
  renderSelected?: (value: TValue | undefined) => ReactNode
  placeholder?: ReactNode
  children?: ReactNode
  onChangeValue?: (value: TClear extends false ? TValue : TValue | undefined) => unknown
  loading?: boolean
  clearRequired?: TClear
  detached?: boolean
  allowInput?: boolean
  inputValue?: string
  onInputChange?: React.ChangeEventHandler<HTMLInputElement>
}

type SelectItemProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
  leadingIcon?: ReactNode
  headlineContent: ReactNode
  supportingContent?: ReactNode
  className?: string
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>((props, ref) => (
  <div
    ref={ref}
    className={props.className}
    css={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}
  >
    {props.leadingIcon && (
      <figure css={{ display: 'flex', alignItems: 'center', maxWidth: 40, maxHeight: 40, margin: 0 }}>
        {props.leadingIcon}
      </figure>
    )}
    <div>
      <Text.Body as="div" alpha="high">
        {props.headlineContent}
      </Text.Body>
      <Text.Body as="div">{props.supportingContent}</Text.Body>
    </div>
  </div>
))

SelectItem.displayName = 'SelectItem'

const findOption = (children: ReactElement): ReactElement<SelectItemProps>[] => {
  if (!children) return []
  if (typeof children === 'string') return []
  if (Array.isArray(children)) return children.map(findOption).flat()

  if (
    typeof children.type === 'object' &&
    'displayName' in children.type &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (children.type as any).displayName === 'SelectItem'
  ) {
    return [children as React.ReactElement<SelectItemProps>]
  }
  return findOption(children.props.children as React.ReactElement)
}

const Select = Object.assign(
  <TValue, TClear extends boolean = false>({
    children,
    clearRequired: _clearRequired,
    detached,
    loading,
    inputValue,
    onInputChange,
    renderSelected,
    ...props
  }: SelectProps<TValue, TClear>) => {
    const theme = useTheme()
    const surfaceColor = useSurfaceColor()

    const listRef = useRef<HTMLLIElement[]>([])
    const listContentRef = useRef<Array<string | null>>([])
    const [open, setOpen] = useState(false)
    const [pointer, setPointer] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const optionsArray = useMemo(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (): React.ReactElement<SelectItemProps>[] => React.Children.map(children as any, findOption)?.flat() ?? [],
      [children]
    )

    const selectedChild =
      renderSelected?.(props.value) ?? optionsArray.find(x => x.props.value === props.value) ?? undefined

    const clearRequired = !open && _clearRequired && selectedChild !== undefined

    // slight overlap for better border radius animation
    const overlap = detached ? 0 : 6

    const { context, x, y, refs, strategy } = useFloating({
      open,
      onOpenChange: open => {
        setOpen(open)
        if (clearRequired) {
          // @ts-expect-error
          props.onChangeValue?.(undefined)
        }
        if (open && props.allowInput && inputRef.current) inputRef.current.focus()
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

    const { getReferenceProps, getFloatingProps } = useInteractions([
      useClick(context, {
        keyboardHandlers: false,
        toggle: false,
      }),
      useDismiss(context, {
        outsidePress: true,
      }),
    ])

    const select = useCallback(
      (value: string | number | undefined) => {
        setOpen(false)
        setActiveIndex(null)
        // @ts-expect-error
        props.onChangeValue?.(value)
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

    // TODO: need a cap as setting maximum radius for only top or bottom corner create oval shape instead
    const cappedShape = `min(2rem, ${theme.shape.full})`

    const injectChildren = useCallback(
      (children: ReactElement, index: number): React.ReactNode => {
        if (!children) return null

        if (typeof children === 'string') return children
        if (Array.isArray(children)) return children.map(injectChildren)

        if (
          typeof children.type === 'object' &&
          'displayName' in children.type &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (children.type as any).displayName === 'SelectItem'
        ) {
          const child = children as ReactElement<SelectItemProps>
          const selected =
            typeof selectedChild === 'object' &&
            child.props.value === (selectedChild as React.ReactElement<SelectItemProps>).props.value
          return (
            <li
              key={child.key}
              role="option"
              ref={node => {
                if (node !== null) {
                  listRef.current[child.props.value] = node
                  listContentRef.current[index] = node?.textContent
                }
              }}
              tabIndex={index === activeIndex ? 0 : 1}
              aria-selected={selected && index === activeIndex}
              onClick={() => select(child.props.value)}
              css={{
                ':hover': {
                  filter: 'brightness(1.2)',
                },
                filter: selected ? 'brightness(1.4)' : undefined,
                cursor: 'pointer',
              }}
            >
              {children}
            </li>
          )
        }
        return React.cloneElement(children, {
          key: children.key ?? index,
          children: children.props.children ? injectChildren(children.props.children, index) : children.props.children,
        })
      },
      [selectedChild, select, activeIndex]
    )

    return (
      <motion.div
        className={props.className}
        initial="false"
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
              border: `solid ${theme.color.outlineVariant}`,
              borderWidth: '1px 1px 0 1px',
              borderRadius: cappedShape,
            },
            false: {
              border: 'solid transparent',
              borderWidth: '1px 1px 0 1px',
              borderRadius: theme.shape.full,
            },
          }}
          css={[
            {
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.6rem',
              textAlign: 'start',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              width: '100%',
            },
            !detached &&
              open && {
                borderBottomLeftRadius: `0 !important`,
                borderBottomRightRadius: `0 !important`,
              },
          ]}
          {...getReferenceProps()}
        >
          {selectedChild ??
            (props.allowInput ? (
              <input
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onChange={onInputChange}
                value={inputValue}
                ref={inputRef}
                placeholder={typeof props.placeholder === 'string' ? props.placeholder : ''}
                onFocus={() => setOpen(true)}
                style={{
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  padding: 0,
                  height: 'max-content',
                  width: '100%',
                }}
              />
            ) : (
              <Text.Body as="div" css={{ pointerEvents: 'none', userSelect: 'none' }}>
                <Text.Body alpha="disabled">{props.placeholder}</Text.Body>
              </Text.Body>
            ))}
          {loading ? (
            <CircularProgressIndicator />
          ) : clearRequired ? (
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
                border: `solid ${theme.color.outlineVariant}`,
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
                margin: 0,
                padding: 0,
                backgroundColor: surfaceColor,
                listStyle: 'none',
                li: {
                  padding: '1.2rem 1.25rem',
                  backgroundColor: surfaceColor,
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
                ? { borderRadius: cappedShape }
                : { borderBottomLeftRadius: cappedShape, borderBottomRightRadius: cappedShape },
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
            })}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {React.Children.map(children as any, injectChildren)}
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
