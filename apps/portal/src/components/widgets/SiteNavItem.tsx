import { cloneElement, HTMLAttributeAnchorTarget, MouseEventHandler, ReactElement, ReactNode } from 'react'
import { NavLink, To } from 'react-router-dom'

import { cn } from '@/util/cn'

export const SiteNavItem = ({
  icon,
  label,
  to,
  onClick,
  target,
}: {
  icon: ReactElement
  label: ReactNode
  to: To
  onClick?: MouseEventHandler<HTMLAnchorElement>
  target?: HTMLAttributeAnchorTarget
}) => (
  <NavLink
    className={({ isActive }) =>
      cn(
        'text-foreground/60 hover:text-foreground flex items-center gap-1 font-bold lg:gap-2',
        isActive && 'text-foreground'
      )
    }
    to={to}
    onClick={onClick}
    target={target}
  >
    {cloneElement(icon, { className: 'h-[1.2em] w-[1.2em] shrink-0 [&_*]:stroke-[1.6]' })}&nbsp;{label}
  </NavLink>
)
