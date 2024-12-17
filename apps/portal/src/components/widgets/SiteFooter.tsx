import { Text } from '@talismn/ui/atoms/Text'

export const SiteFooter = () => {
  return (
    <div
      css={theme => ({
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        gap: '3.2rem',
        padding: '2.4rem 2.4rem 2.4rem 0',
        a: { opacity: theme.contentAlpha.medium, ':hover': { opacity: theme.contentAlpha.high } },
      })}
    >
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
  )
}
