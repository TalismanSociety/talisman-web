import { Zap } from '@talismn/icons'
import {
  FULL_SCREEN_DIALOG_WIDE_BREAK_POINT_SELECTOR,
  FullScreenDialog,
  InfoCard,
  type InfoCardProps,
  Text,
} from '@talismn/ui'
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
    <FullScreenDialog
      {...props}
      title={
        <div>
          <Zap /> Stake
        </div>
      }
      css={{
        [`${FULL_SCREEN_DIALOG_WIDE_BREAK_POINT_SELECTOR}`]: {
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
    </FullScreenDialog>
  ),
  {
    LearnMore,
    Stats: Object.assign(
      (props: PropsWithChildren) => (
        <section {...props} css={{ display: 'flex', alignItems: 'center', gap: '1.6rem', marginBottom: '3.2rem' }} />
      ),
      { Item: (props: InfoCardProps) => <InfoCard {...props} css={{ flex: 1 }} /> }
    ),
  }
)

export default StakeDialog
