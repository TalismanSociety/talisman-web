import Discord from '@/assets/icons/discord.svg?react'
import GitHub from '@/assets/icons/github.svg?react'
import XSocial from '@/assets/icons/x-social.svg?react'
import { cn } from '@/util/cn'

export const SiteFooter = ({ className }: { className?: string }) => {
  return (
    <footer className={cn('pb-8', className)}>
      <div className="flex items-center justify-center gap-8">
        <a href="https://x.com/wearetalisman" target="_blank" rel="noreferrer noopener">
          <XSocial width="1em" />
        </a>
        <a href="https://discord.gg/talisman" target="_blank" rel="noreferrer noopener">
          <Discord width="1em" />
        </a>
        <a href="https://github.com/talismansociety" target="_blank" rel="noreferrer noopener">
          <GitHub width="1em" />
        </a>
        <a href="https://docs.talisman.xyz" target="_blank" rel="noreferrer noopener">
          Docs
        </a>
        <a href="https://docs.talisman.xyz/talisman/about/terms-of-use" target="_blank" rel="noreferrer noopener">
          Terms
        </a>
        <a href="https://docs.talisman.xyz/talisman/about/privacy-policy" target="_blank" rel="noreferrer noopener">
          Privacy
        </a>
      </div>
    </footer>
  )
}
