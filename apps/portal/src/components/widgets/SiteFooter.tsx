import { ReactNode } from 'react'

import Discord from '@/assets/icons/discord.svg?react'
import GitHub from '@/assets/icons/github.svg?react'
import XSocial from '@/assets/icons/x-social.svg?react'
import { cn } from '@/util/cn'

export const SiteFooter = ({ className }: { className?: string }) => {
  return (
    <footer className={cn('pb-8', className)}>
      <div className="flex items-center justify-center gap-8">
        <FooterLink href="https://x.com/wearetalisman">
          <XSocial width="1em" />
        </FooterLink>
        <FooterLink href="https://discord.gg/talisman">
          <Discord width="1em" />
        </FooterLink>
        <FooterLink href="https://github.com/talismansociety">
          <GitHub width="1em" />
        </FooterLink>
        <FooterLink href="https://docs.talisman.xyz">Docs</FooterLink>
        <FooterLink href="https://docs.talisman.xyz/talisman/about/terms-of-use">Terms</FooterLink>
        <FooterLink href="https://docs.talisman.xyz/talisman/about/privacy-policy">Privacy</FooterLink>
      </div>
    </footer>
  )
}

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    className="text-foreground/60 hover:text-foreground focus:text-foreground"
    href={href}
    target="_blank"
    rel="noreferrer noopener"
  >
    {children}
  </a>
)
