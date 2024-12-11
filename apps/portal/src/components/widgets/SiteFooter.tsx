import { Text } from '@talismn/ui/atoms/Text'

import { cn } from '@/util/cn'

export const SiteFooter = ({ className }: { className?: string }) => {
  return (
    <footer className={cn('pb-8', className)}>
      <div className="flex items-center justify-center gap-4">
        <Text.BodyLarge alpha="high" as="a" href="https://twitter.com/wearetalisman" target="_blank">
          Twitter
        </Text.BodyLarge>
        <Text.BodyLarge alpha="high" as="a" href="https://discord.gg/talisman" target="_blank">
          Discord
        </Text.BodyLarge>
        <Text.BodyLarge alpha="high" as="a" href="https://docs.talisman.xyz" target="_blank">
          Docs
        </Text.BodyLarge>
        <Text.BodyLarge
          alpha="high"
          as="a"
          href="https://docs.talisman.xyz/talisman/legal-and-security/terms-of-use"
          target="_blank"
        >
          Terms
        </Text.BodyLarge>
        <Text.BodyLarge
          alpha="high"
          as="a"
          href="https://docs.talisman.xyz/talisman/legal-and-security/privacy-policy"
          target="_blank"
        >
          Privacy
        </Text.BodyLarge>
      </div>
    </footer>
  )
}
