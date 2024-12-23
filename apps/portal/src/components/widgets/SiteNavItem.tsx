import { cloneElement, HTMLAttributeAnchorTarget, ReactElement, ReactNode } from 'react'
import { NavLink, To } from 'react-router-dom'

import { cn } from '@/util/cn'

export const SiteNavItem = ({
  icon,
  label,
  to,
  target,
}: {
  icon: ReactElement
  label: ReactNode
  to: To
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
    target={target}
  >
    {cloneElement(icon, { className: 'h-[1.2em] w-[1.2em] shrink-0 [&_*]:stroke-[1.6]' })}&nbsp;{label}
  </NavLink>
)
