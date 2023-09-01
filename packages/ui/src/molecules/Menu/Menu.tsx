import { useTheme } from '@emotion/react'
import {
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
  type Placement,
  type ReferenceType,
  type Strategy,
  type ExtendedRefs,
} from '@floating-ui/react'
import { motion } from 'framer-motion'
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type DetailedHTMLProps,
  type HTMLAttributes,
  type HTMLProps,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Surface, useSurfaceColor } from '../..'
import FloatingPortal from '../../atoms/FloatingPortal'

export const MENU_OFFSET = 12

export const MENU_BORDER_RADIUS = '1.2rem'

export type MenuProps = {
  children: [ReactElement<MenuButtonProps>, ReactElement<MenuItemsProps>]
}

export type MenuButtonProps = { children: ReactNode | ((props: { open: boolean }) => ReactNode) }

export type MenuItemsProps = Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, 'children'> & {
  children: ReactNode | ((props: { open: boolean; toggleOpen: () => unknown }) => ReactNode)
}

export type MenuItemProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  dismissAfterSelection?: boolean
}

const MenuContext = createContext<{
  nodeId?: string
  x: number | null
  y: number | null
  strategy: Strategy
  placement: Placement
  refs: ExtendedRefs<ReferenceType>
  getReferenceProps: (props?: HTMLProps<HTMLElement>) => any
  getFloatingProps: (props?: HTMLProps<HTMLElement>) => any
  getItemProps: (props?: HTMLProps<HTMLElement>) => any
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  nodeId: '',
  x: 0,
  y: 0,
  strategy: 'absolute',
  placement: 'bottom-start',
  refs: {} as any,
  getReferenceProps: props => props,
  getFloatingProps: props => props,
  getItemProps: props => props,
  open: false,
  setOpen: () => {},
})

const MenuButton = ({ children, ...props }: MenuButtonProps) => {
  const { refs, getReferenceProps, open } = useContext(MenuContext)
  return (
    <div ref={refs.setReference} {...getReferenceProps(props)} css={{ width: 'fit-content' }}>
      {typeof children === 'function' ? children({ open }) : children}
    </div>
  )
}

const MenuItems = (props: MenuItemsProps) => {
  const theme = useTheme()
  const [animating, setAnimating] = useState(false)
  const { nodeId, x, y, strategy, placement, refs, getFloatingProps, open, setOpen } = useContext(MenuContext)

  const closedClipPath = useMemo(() => {
    switch (placement) {
      case 'top-start':
        return `inset(100% 100% 0 0 round ${MENU_BORDER_RADIUS})`
      case 'top-end':
        return `inset(100% 0 0 100% round ${MENU_BORDER_RADIUS})`
      case 'bottom-start':
        return `inset(0 100% 100% 0 round ${MENU_BORDER_RADIUS})`
      case 'bottom-end':
        return `inset(0 0 100% 100% round ${MENU_BORDER_RADIUS})`
      default:
        return `inset(0 50% 100% 50% round ${MENU_BORDER_RADIUS})`
    }
  }, [placement])

  const children =
    typeof props.children === 'function'
      ? props.children({ open, toggleOpen: () => setOpen(open => !open) })
      : props.children

  return (
    <FloatingPortal id={nodeId}>
      {(open || animating) && (
        <Surface
          as={motion.section}
          ref={refs.setFloating}
          elevation={x => x + 1}
          onAnimationStart={() => setAnimating(true)}
          onAnimationComplete={() => setAnimating(false)}
          variants={{
            true: {
              clipPath: `inset(0% 0% 0% 0% round ${MENU_BORDER_RADIUS})`,
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
          }}
          {...getFloatingProps({
            ...props,
            style: { ...props.style, position: strategy, top: y ?? 0, left: x ?? 0, width: 'max-content' },
            children,
          })}
        />
      )}
    </FloatingPortal>
  )
}

const MenuItem = ({ dismissAfterSelection = true, ...props }: MenuItemProps) => {
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
          backgroundColor: useSurfaceColor(),
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

  const { context, x, y, refs, strategy, placement } = useFloating({
    nodeId,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(MENU_OFFSET),
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
        refs,
        getReferenceProps,
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
