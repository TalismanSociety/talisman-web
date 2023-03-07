import { useTheme } from '@emotion/react'
import { Lock, Rocket } from '@talismn/icons'
import { Chip, ChipProps, Identicon, ListItem, Text } from '@talismn/ui'
import Color from 'colorjs.io'
import { ReactNode, useMemo } from 'react'

export type StakeItemProps = {
  actions?: ReactNode
  status?: ReactNode
}

export const IncreaseStakeChip = (props: Omit<ChipProps, 'children'>) => <Chip {...props}>Increase stake</Chip>

export const UnstakeChip = (props: Omit<ChipProps, 'children'>) => <Chip {...props}>Unstake</Chip>

export const ClaimChip = ({ amount, ...props }: Omit<ChipProps, 'children'> & { amount: ReactNode }) => {
  const theme = useTheme()
  const claimChipContainerColor = useMemo(() => {
    const color = new Color(theme.color.primary)
    color.alpha = 0.125
    return color.display().toString()
  }, [theme.color.primary])
  return (
    <Chip {...props} containerColor={claimChipContainerColor} contentColor={theme.color.primary}>
      Claim {amount}
    </Chip>
  )
}

export const FastUnstakeChip = (props: Omit<ChipProps, 'children'>) => (
  <Chip {...props} leadingContent={<Rocket size="1em" />}>
    Fast unstake
  </Chip>
)

const StakeItem = (props: StakeItemProps) => {
  const theme = useTheme()

  return (
    <article css={{ borderRadius: '0.8rem', overflow: 'hidden' }}>
      <ListItem
        leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
        headlineText="Dev wallet"
        supportingText={
          <Text.Body css={{ display: 'flex', alignItems: 'center', gap: '0.25em' }}>
            <Text.Body css={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Talisman Pool 1: app.talisman.xyz
            </Text.Body>
          </Text.Body>
        }
        trailingContent={
          <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Text.BodyLarge as="div" css={{ fontWeight: 'bold' }}>
              3,013.33 DOT <Lock size="1em" />
            </Text.BodyLarge>
            <Text.BodyLarge as="div">$24,358.05</Text.BodyLarge>
          </div>
        }
        css={{ backgroundColor: theme.color.surface }}
      />
      <div
        css={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          gap: '0.8rem',
          padding: '0.8rem 1.6rem',
          backgroundColor: theme.color.foreground,
        }}
      >
        <div css={{ display: 'flex', gap: '0.8rem' }}>{props.actions}</div>
        <Text.Body
          css={{
            flex: 1,
            justifyContent: 'flex-end',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25em',
            whiteSpace: 'nowrap',
          }}
        >
          {props.status}
        </Text.Body>
      </div>
    </article>
  )
}

export default StakeItem
