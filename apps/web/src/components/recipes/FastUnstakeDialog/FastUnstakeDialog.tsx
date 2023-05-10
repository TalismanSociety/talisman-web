import { AlertDialog, Button, DescriptionList, EyeOfSauronProgressIndicator, Hr, Text } from '@talismn/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'

export type FastUnstakeDialogProps = {
  open?: boolean
  amount: string
  fiatAmount: string
  lockDuration: string
  fastUnstakeEligibility?: 'pending' | 'eligible' | 'ineligible'
  onDismiss: () => unknown
  onConfirm: () => unknown
  learnMoreHref: string
}

const FastUnstakeDialog = (props: FastUnstakeDialogProps) => (
  <AlertDialog
    open={props.open}
    width="48rem"
    title="Fast unstake"
    content={
      <>
        <Text.Body as="p" css={{ textAlign: 'center', marginBottom: '4rem' }}>
          Fast unstaking allows you to bypass the {props.lockDuration} unstaking period, however you cannot have earned
          rewards within the past {props.lockDuration} to be eligible.{' '}
          <Text.Body.A href={props.learnMoreHref} target="_blank">
            Learn more
          </Text.Body.A>
        </Text.Body>
        <EyeOfSauronProgressIndicator
          state={useMemo(() => {
            switch (props.fastUnstakeEligibility) {
              case 'pending':
                return 'pending'
              case 'eligible':
                return 'fulfilled'
              case 'ineligible':
                return 'rejected'
            }
          }, [props.fastUnstakeEligibility])}
        />
        <div css={{ overflow: 'hidden' }}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={props.fastUnstakeEligibility}
              initial={props.fastUnstakeEligibility === 'pending' ? undefined : { opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
            >
              {useMemo(() => {
                switch (props.fastUnstakeEligibility) {
                  case 'pending':
                    return (
                      <Text.Body as="p" css={{ textAlign: 'center', marginTop: '2.4rem' }}>
                        Checking eligibility
                        <br />
                        This may take up to 30 seconds
                      </Text.Body>
                    )
                  case 'eligible':
                    return (
                      <div>
                        <Text.H4 css={{ textAlign: 'center', marginTop: '2.4rem' }}>
                          You’re eligible for fast unstaking!
                        </Text.H4>
                        <Hr />
                        <DescriptionList>
                          <DescriptionList.Description>
                            <DescriptionList.Term>Unstake amount</DescriptionList.Term>
                            <DescriptionList.Details>
                              <Text.Body alpha="high">{props.amount}</Text.Body>
                              <Text.Body>{props.fiatAmount}</Text.Body>
                            </DescriptionList.Details>
                          </DescriptionList.Description>
                        </DescriptionList>
                      </div>
                    )
                  case 'ineligible':
                    return (
                      <Text.Body as="p" alpha="high" css={{ textAlign: 'center', marginTop: '2.4rem' }}>
                        Unfortunately, you’re not eligible for fast unstaking.
                        <br />
                        <br />
                        You can still unstake below as normal and start earning rewards after {props.lockDuration}.
                      </Text.Body>
                    )
                }
              }, [props.amount, props.fastUnstakeEligibility, props.fiatAmount, props.lockDuration])}
            </motion.div>
          </AnimatePresence>
        </div>
      </>
    }
    dismissButton={
      props.fastUnstakeEligibility === 'ineligible' && (
        <Button variant="outlined" onClick={props.onDismiss}>
          Close
        </Button>
      )
    }
    confirmButton={
      <Button onClick={props.onConfirm} disabled={props.fastUnstakeEligibility === 'pending'}>
        {props.fastUnstakeEligibility === 'ineligible' ? 'Unstake' : 'Fast unstake'}
      </Button>
    }
    onRequestDismiss={props.onDismiss}
  />
)

export default FastUnstakeDialog
