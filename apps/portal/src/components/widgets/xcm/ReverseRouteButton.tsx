import type { ButtonProps } from '@talismn/ui'
import { TonalIconButton } from '@talismn/ui'
import { ArrowDown, Repeat } from '@talismn/web-icons'

import { cn } from '@/lib/utils'

export const ReverseRouteButton = ({ onClick, disabled }: Pick<ButtonProps<'button'>, 'onClick' | 'disabled'>) => (
  <TonalIconButton className="group relative lg:-rotate-90" onClick={onClick} disabled={disabled}>
    <ArrowDown
      className={cn(
        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100',
        disabled || 'group-hover:opacity-0'
      )}
    />
    <Repeat
      className={cn(
        'rotate-0 opacity-0',
        disabled || 'group-hover:rotate-90 group-hover:opacity-100 group-hover:transition-transform group-hover:ease-in'
      )}
    />
  </TonalIconButton>
)
