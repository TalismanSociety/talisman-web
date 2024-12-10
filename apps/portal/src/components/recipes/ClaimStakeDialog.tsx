import type { ReactNode } from 'react'
import { Button } from '@talismn/ui/atoms/Button'
import { Text } from '@talismn/ui/atoms/Text'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'

export type ClaimStakeDialogProps = {
  open?: boolean
  amount: ReactNode
  fiatAmount: ReactNode
  onRequestDismiss: () => unknown
  onRequestReStake: () => unknown
  onRequestClaim: () => unknown
}

export const ClaimStakeDialog = (props: ClaimStakeDialogProps) => (
  <AlertDialog
    open={props.open}
    targetWidth="54rem"
    title="Claim rewards"
    content={
      <div>
        <Text.Body>
          You are claiming{' '}
          <Text.Body alpha="high">
            {props.amount} ({props.fiatAmount})
          </Text.Body>
          <br />
          <br />
          You can claim your staking rewards either by re-staking (compounding) in the same nomination pool, or by
          claiming them as a freely available balance.
        </Text.Body>
      </div>
    }
    dismissButton={
      <Button variant="outlined" onClick={props.onRequestReStake}>
        Re-stake
      </Button>
    }
    confirmButton={
      <Button variant="outlined" onClick={props.onRequestClaim}>
        Claim
      </Button>
    }
    onRequestDismiss={props.onRequestDismiss}
  />
)
