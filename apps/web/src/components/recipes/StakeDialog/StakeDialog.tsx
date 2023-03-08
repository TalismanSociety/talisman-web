import { Zap } from '@talismn/icons'
import { FulScreenDialogQuarterSelector, FullScreenDialog, Text } from '@talismn/ui'
import { AnchorHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

export type StakeDialogProps = {
  open?: boolean
  onRequestDismiss: () => unknown
  stakeInput: ReactNode
  learnMoreAnchor: ReactNode
}

const LearnMore = (props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => (
  <Text.Body.A {...props}>Learn more</Text.Body.A>
)

const StakeDialog = Object.assign(
  ({ stakeInput, learnMoreAnchor, ...props }: StakeDialogProps) => (
    <FullScreenDialog
      {...props}
      title={
        <div>
          <Zap /> Stake
        </div>
      }
      css={{
        [`${FulScreenDialogQuarterSelector}`]: {
          minWidth: '51.2rem',
        },
      }}
    >
      {stakeInput}
      <Text.Body as="p" css={{ marginTop: '4.8rem' }}>
        Nomination pools allow participants to permissionlessly pool funds together to stake as a group. Benefits of
        contributing your stake to a nomination pool include no staking minimum, no need for a stash and controller
        account, and the selection of validators on your behalf. {learnMoreAnchor}.
      </Text.Body>
    </FullScreenDialog>
  ),
  { LearnMore }
)

export default StakeDialog
