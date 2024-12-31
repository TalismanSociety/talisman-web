import { ReactNode } from 'react'

import { cn } from '@/util/cn'

export const PageHeader = ({ className, children }: { className?: string; children?: ReactNode }) => (
  <div className={cn('flex flex-col items-center justify-stretch gap-4', 'lg:flex-row lg:justify-between', className)}>
    {children}
  </div>
)

export const PageHeaderItem = ({ className, children }: { className?: string; children?: ReactNode }) => (
  <div
    className={cn(
      'flex flex-1 items-center gap-4 [&:nth-of-type(2)]:justify-center [&:nth-of-type(3)]:justify-end',
      className
    )}
  >
    {children}
  </div>
)
