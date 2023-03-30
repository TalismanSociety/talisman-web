import { useTheme } from '@emotion/react'
import {
  FloatingPortal,
  Placement,
  ReferenceType,
  Strategy,
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { motion } from 'framer-motion'
import {
  DetailedHTMLProps,
  HTMLAttributes,
  HTMLProps,
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

export const OFFSET = 12

export const BORDER_RADIUS = '1.2rem'

export type MenuProps = {
  children: [ReactElement<MenuButtonProps>, ReactElement<MenuItemsProps>]
}

export type MenuButtonProps = { children: ReactNode | ((props: { open: boolean }) => ReactNode) }

export type MenuItemsProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

export type MenuItemProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  dismissAfterSelection?: boolean
}

const MenuContext = createContext<{
  nodeId?: string
  x: number | null
  y: number | null
  strategy: Strategy
  placement: Placement
  reference: (node: ReferenceType | null) => void
  getReferenceProps: (props?: HTMLProps<HTMLElement>) => any
  floating: (node: HTMLElement | null) => void
  getFloatingProps: (props?: HTMLProps<HTMLElement>) => any
  getItemProps: (props?: HTMLProps<HTMLElement>) => any
  open: boolean
  setOpen: (value: boolean) => unknown
}>({
  nodeId: '',
  x: 0,
  y: 0,
  strategy: 'absolute',
  placement: 'bottom-start',
  reference: () => {},
  getReferenceProps: props => props,
  floating: () => {},
  getFloatingProps: props => props,
  getItemProps: props => props,
  open: false,
  setOpen: () => {},
})

const MenuButton = ({ children, ...props }: MenuButtonProps) => {
  const { reference, getReferenceProps, open } = useContext(MenuContext)
  return (
    <div ref={reference} {...getReferenceProps(props)} css={{ width: 'fit-content' }}>
      {typeof children === 'function' ? children({ open }) : children}
    </div>
  )
}

const MenuItems = (props: MenuItemsProps) => {
  const theme = useTheme()
  const [animating, setAnimating] = useState(false)
  const { nodeId, x, y, strategy, placement, floating, getFloatingProps, open } = useContext(MenuContext)

  const closedClipPath = useMemo(() => {
    switch (placement) {
      case 'top-start':
        return `inset(100% 100% 0 0 round ${BORDER_RADIUS})`
      case 'top-end':
        return `inset(100% 0 0 100% round ${BORDER_RADIUS})`
      case 'bottom-start':
        return `inset(0 100% 100% 0 round ${BORDER_RADIUS})`
      case 'bottom-end':
        return `inset(0 0 100% 100% round ${BORDER_RADIUS})`
      default:
        return `inset(0 50% 100% 50% round ${BORDER_RADIUS})`
    }
  }, [placement])

  return (
    <FloatingPortal id={nodeId}>
      {(open || animating) && (
        <motion.section
          ref={floating}
          onAnimationStart={() => setAnimating(true)}
          onAnimationComplete={() => setAnimating(false)}
          variants={{
            true: {
              clipPath: `inset(0% 0% 0% 0% round ${BORDER_RADIUS})`,
              transitionEnd: {
                overflow: 'auto',
              },
              transition: {
                type: 'spring',
                bounce: 0,
                duration: 0.35,
                delayChildren: 0.15,
                staggerChildren: 0.025,
              },
            },
            false: {
              clipPath: closedClipPath,
              overflow: false,
              transition: {
                type: 'spring',
                bounce: 0,
                duration: 0.15,
              },
            },
          }}
          css={{
            border: `1px solid ${theme.color.border}`,
            borderRadius: '1.2rem',
            backgroundColor: theme.color.surface,
          }}
          {...getFloatingProps({
            ...props,
            style: { ...props.style, position: strategy, top: y ?? 0, left: x ?? 0, width: 'max-content' },
          })}
        />
      )}
    </FloatingPortal>
  )
}

const MenuItem = ({ dismissAfterSelection = true, ...props }: MenuItemProps) => {
  const theme = useTheme()
  const { getItemProps, setOpen } = useContext(MenuContext)
  return (
    <motion.div
      variants={{
        true: { opacity: 1, transform: 'translateY(0px)', transition: { type: 'spring', stiffness: 300, damping: 24 } },
        false: { opacity: 0, transform: 'translateY(20px)', transition: { duration: 0.1 } },
      }}
      css={{
        'cursor': 'pointer',
        ':hover': {
          backgroundColor: theme.color.foreground,
        },
      }}
      {...getItemProps({
        ...props,
        onClick: (event: any) => {
          props.onClick?.(event)
          if (dismissAfterSelection) {
            setOpen(false)
          }
        },
      })}
    />
  )
}

const Menu = (props: MenuProps) => {
  const nodeId = useFloatingNodeId()
  const [open, setOpen] = useState(false)

  const { context, x, y, reference, floating, strategy, placement } = useFloating({
    nodeId,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(OFFSET),
      autoPlacement({ allowedPlacements: ['top-start', 'top-end', 'bottom-start', 'bottom-end'] }),
      shift(),
      size({
        apply: ({ availableHeight, elements }) => {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
          })
        },
      }),
    ],
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useRole(context, { role: 'menu' }),
    useClick(context),
    useDismiss(context),
  ])

  return (
    <MenuContext.Provider
      value={{
        nodeId,
        x,
        y,
        strategy,
        placement,
        reference,
        getReferenceProps,
        floating,
        getFloatingProps,
        getItemProps,
        open,
        setOpen,
      }}
    >
      <motion.div initial={String(false)} animate={String(open)}>
        {props.children}
      </motion.div>
    </MenuContext.Provider>
  )
}

export default Object.assign(Menu, { Button: MenuButton, Items: MenuItems, Item: MenuItem })
