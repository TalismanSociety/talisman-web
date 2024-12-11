import { HTMLAttributeAnchorTarget, ReactNode } from 'react'
import { NavLink, To } from 'react-router-dom'

import { cn } from '@/util/cn'

export const PageTabs = ({ className, children }: { className?: string; children?: ReactNode }) => {
  return (
    <nav
      className={cn(
        'flex list-none items-center justify-center gap-4 rounded-[16px] p-4 text-2xl',
        'bg-background border border-gray-700',
        className
      )}
    >
      {children}
    </nav>
  )
}

export const PageTab = ({
  className,
  children,
  to,
  target,
  end,
}: {
  className?: string
  children?: ReactNode
  to: To
  target?: HTMLAttributeAnchorTarget
  end?: boolean
}) => {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'flex w-full flex-1 items-center justify-center gap-2 whitespace-pre rounded-[8px] px-10 py-4',
          'text-foreground/60 hover:text-foreground hover:bg-white/10',
          isActive && 'text-foreground bg-white/5',
          className
        )
      }
      to={to}
      target={target}
      end={end}
    >
      {children}
    </NavLink>
  )
}
