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
  type ExtendedRefs,
  type Placement,
  type ReferenceType,
  type Strategy,
} from '@floating-ui/react'
import { motion } from 'framer-motion'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type DetailedHTMLProps,
  type HTMLAttributes,
  type HTMLProps,
  type ReactElement,
  type ReactNode,
} from 'react'
import { ListItem, Surface, useSurfaceColor } from '../..'
import FloatingPortal from '../../atoms/FloatingPortal'
import { usePrevious } from '../../utils'

export const MENU_OFFSET = 12

export type MenuProps = {
  children: [ReactElement<MenuButtonProps>, ReactElement<MenuItemsProps>]
}

export type MenuButtonProps = { children: ReactNode | ((props: { open: boolean }) => ReactNode) }

export type MenuItemsProps = Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, 'children'> & {
  children: ReactNode | ((props: { open: boolean; toggleOpen: () => unknown }) => ReactNode)
}

type MenuItemRenderProps = { hover: boolean }

type MenuItemChildren = ReactNode | ((props: MenuItemRenderProps) => ReactNode)

export type MenuItemProps = {
  className?: string
  children: MenuItemChildren
  dismissAfterSelection?: boolean
  inTransition?: boolean
  onClick?: () => unknown
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
    <div ref={refs.setReference} {...getReferenceProps(props)} css={{ width: 'fit-content', cursor: 'pointer' }}>
      {typeof children === 'function' ? children({ open }) : children}
    </div>
  )
}

const MenuItems = (props: MenuItemsProps) => {
  const theme = useTheme()
  const [animating, setAnimating] = useState(false)
  const { nodeId, x, y, strategy, refs, getFloatingProps, open, setOpen } = useContext(MenuContext)

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
              scale: 1,
              opacity: 1,
              transition: {
                delayChildren: 0.15,
                staggerChildren: 0.025,
              },
            },
            false: {
              scale: 0.95,
              opacity: 0,
            },
          }}
          css={{
            border: `1px solid ${theme.color.outlineVariant}`,
            borderRadius: theme.shape.small,
            overflow: 'auto',
            '.talismn-ui-menu-item:first-child': { marginTop: '0.8rem' },
            '.talismn-ui-menu-item:last-child': { marginBottom: '0.8rem' },
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

const renderMenuItemChildren = (children: MenuItemChildren, renderProps: MenuItemRenderProps) =>
  typeof children === 'function' ? children(renderProps) : children

const MenuItem = Object.assign(
  ({ children: childrenOrRenderFunc, dismissAfterSelection = true, inTransition, ...props }: MenuItemProps) => {
    const theme = useTheme()

    const { getItemProps, setOpen } = useContext(MenuContext)

    const prevInTransition = usePrevious(inTransition)

    useEffect(() => {
      if (inTransition === false && prevInTransition === true) {
        setOpen(false)
      }
    }, [inTransition, prevInTransition, setOpen])

    const [hover, setHover] = useState(false)
    const children = renderMenuItemChildren(childrenOrRenderFunc, { hover })

    return (
      <motion.div
        className={['talismn-ui-menu-item', props.className].join(' ')}
        variants={{
          true: { opacity: 1, transform: 'translateY(0px)' },
          false: { opacity: 0, transform: 'translateY(20px)' },
        }}
        css={{
          margin: '0 0.8rem',
          borderRadius: theme.shape.extraSmall,
          cursor: 'pointer',
          ':hover': {
            backgroundColor: useSurfaceColor(),
          },
        }}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        {...getItemProps({
          ...props,
          children,
          onClick: () => {
            props.onClick?.()
            if (dismissAfterSelection) {
              setOpen(false)
            }
          },
        })}
      />
    )
  },
  {
    Button: ({
      headlineContent,
      overlineContent,
      supportingContent,
      leadingContent,
      trailingContent,
      revealTrailingContentOnHover,
      ...props
    }: Omit<MenuItemProps, 'children'> & {
      headlineContent: MenuItemChildren
      overlineContent?: MenuItemChildren
      supportingContent?: MenuItemChildren
      leadingContent?: MenuItemChildren
      trailingContent?: MenuItemChildren
      revealTrailingContentOnHover?: boolean
    }) => (
      <MenuItem {...props}>
        {renderProps => (
          <ListItem
            headlineContent={renderMenuItemChildren(headlineContent, renderProps)}
            overlineContent={renderMenuItemChildren(overlineContent, renderProps)}
            supportingContent={renderMenuItemChildren(supportingContent, renderProps)}
            leadingContent={renderMenuItemChildren(leadingContent, renderProps)}
            trailingContent={renderMenuItemChildren(trailingContent, renderProps)}
            revealTrailingContentOnHover={revealTrailingContentOnHover}
          />
        )}
      </MenuItem>
    ),
  }
)

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
