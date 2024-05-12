import { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet, InfoCard, type InfoCardProps, Text } from '@talismn/ui'
import { Zap } from '@talismn/web-icons'
import { type AnchorHTMLAttributes, type DetailedHTMLProps, type PropsWithChildren, type ReactNode } from 'react'

export type StakeDialogProps = {
  open?: boolean
  onRequestDismiss: () => unknown
  stats: ReactNode
  stakeInput: ReactNode
  learnMoreAnchor: ReactNode
}

const LearnMore = (props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => (
  <Text.Body.A {...props}>Learn more</Text.Body.A>
)

const StakeDialog = Object.assign(
  ({ stats, stakeInput, learnMoreAnchor, ...props }: StakeDialogProps) => (
    <SideSheet
      {...props}
      title={
        <div>
          <Zap /> Stake
        </div>
      }
      subtitle="Nomination pool staking"
      css={{
        [`${SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR}`]: {
          minWidth: '51.2rem',
        },
      }}
    >
      {stats}
      {stakeInput}
      <Text.Body as="p" css={{ marginTop: '4.8rem' }}>
        Nomination pools allow participants to permissionlessly pool funds together to stake as a group. Benefits of
        contributing your stake to a nomination pool include no staking minimum, no need for a stash and controller
        account, and the selection of validators on your behalf. {learnMoreAnchor}.
      </Text.Body>
    </SideSheet>
  ),
  {
    LearnMore,
    Stats: Object.assign(
      (props: PropsWithChildren) => (
        <section {...props} css={{ display: 'flex', alignItems: 'center', gap: '1.6rem', marginBottom: '1.6rem' }} />
      ),
      { Item: (props: InfoCardProps) => <InfoCard {...props} css={{ flex: 1 }} /> }
    ),
  }
)

export default StakeDialog
