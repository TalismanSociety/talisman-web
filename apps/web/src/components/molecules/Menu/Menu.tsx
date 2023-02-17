import { useTheme } from '@emotion/react'
import {
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
  useInteractions,
  useRole,
} from '@floating-ui/react-dom-interactions'
import { motion } from 'framer-motion'
import {
  DetailedHTMLProps,
  HTMLAttributes,
  HTMLProps,
  PropsWithChildren,
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

const MenuContext = createContext<{
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
}>({
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
})

const MenuButton = ({ children, ...props }: MenuButtonProps) => {
  const { reference, getReferenceProps, open } = useContext(MenuContext)
  return (
    <div ref={reference} {...getReferenceProps(props)}>
      {typeof children === 'function' ? children({ open }) : children}
    </div>
  )
}

const MenuItems = (props: MenuItemsProps) => {
  const theme = useTheme()
  const { floating, x, y, strategy, placement, getFloatingProps } = useContext(MenuContext)

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
    <motion.section
      ref={floating}
      variants={{
        true: {
          clipPath: `inset(0% 0% 0% 0% round ${BORDER_RADIUS})`,
          transition: {
            type: 'spring',
            bounce: 0,
            duration: 0.7,
            delayChildren: 0.3,
            staggerChildren: 0.05,
          },
        },
        false: {
          clipPath: closedClipPath,
          transition: {
            type: 'spring',
            bounce: 0,
            duration: 0.3,
          },
        },
      }}
      css={{
        border: `1px solid ${theme.color.border}`,
        borderRadius: '1.2rem',
        padding: '1.6rem',
        backgroundColor: theme.color.surface,
      }}
      {...getFloatingProps({
        ...props,
        style: { ...props.style, position: strategy, top: y ?? 0, left: x ?? 0, width: 'max-content' },
      })}
    />
  )
}

const MenuItem = (props: PropsWithChildren) => {
  const { getItemProps } = useContext(MenuContext)
  return (
    <motion.div
      variants={{
        true: {
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
        false: { opacity: 0, y: 20, transition: { duration: 0.2 } },
      }}
      {...getItemProps(props)}
    />
  )
}

const Menu = (props: MenuProps) => {
  const [open, setOpen] = useState(false)

  const { context, x, y, reference, floating, strategy, placement } = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      size({
        apply: ({ availableHeight, elements }) => {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
          })
        },
      }),
      offset(OFFSET),
      autoPlacement({ allowedPlacements: ['top-start', 'top-end', 'bottom-start', 'bottom-end'] }),
      shift(),
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
      }}
    >
      <motion.div initial={String(false)} animate={String(open)}>
        {props.children}
      </motion.div>
    </MenuContext.Provider>
  )
}

export default Object.assign(Menu, { Button: MenuButton, Items: MenuItems, Item: MenuItem })
