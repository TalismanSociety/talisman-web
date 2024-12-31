import Logo from '@/assets/logo.svg?react'
import { cn } from '@/util/cn'

export const SiteLogo = ({ responsive }: { responsive?: boolean }) => (
  <div className="flex select-none items-center gap-2">
    <Logo />
    <div className="text-foreground flex items-center gap-1">
      <div className={cn('font-surtexpanded text-3xl', responsive ? 'hidden lg:block' : '')}>Talisman</div>
      <div
        className={cn(
          'font-surtexpanded text-3xl',
          responsive ? 'lg:text-foreground/60 hidden md:block' : 'text-foreground/60'
        )}
      >
        Portal
      </div>
    </div>
  </div>
)
