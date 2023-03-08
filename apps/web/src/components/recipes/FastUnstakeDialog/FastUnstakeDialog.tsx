import { AlertDialog, Button, DescriptionList, EyeOfSauronProgressIndicator, Hr, Text } from '@talismn/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'

export type FastUnstakeDialogProps = {
  open: boolean
  onDismiss: () => unknown
  onConfirm: () => unknown
  fastUnstakeEligibility?: 'pending' | 'eligible' | 'ineligible'
  confirmState?: 'pending' | 'disabled'
}

const FastUnstakeDialog = (props: FastUnstakeDialogProps) => (
  <AlertDialog
    open={props.open}
    title="Fast unstake"
    content={
      <>
        <Text.Body as="p" css={{ textAlign: 'center', marginBottom: '4rem' }}>
          Fast unstaking allows you to bypass the 28 day unstaking period, however you cannot have earned rewards within
          the past 28 days to be eligible. <Text.Body.A href="#">Learn more</Text.Body.A>
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
                        This may take upto 30 seconds
                        <br />
                        Checked 1 of 28 days....
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
                              <Text.Body alpha="high">3244.69 DOT</Text.Body>
                              <Text.Body>$214,544.55</Text.Body>
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
                        You can still unstake below as normal and start earning rewards after 28 days.
                      </Text.Body>
                    )
                }
              }, [props.fastUnstakeEligibility])}
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
      <Button
        onClick={props.onConfirm}
        disabled={props.fastUnstakeEligibility === 'pending'}
        loading={props.confirmState === 'pending'}
      >
        {props.fastUnstakeEligibility === 'ineligible' ? 'Unstake' : 'Fast unstake'}
      </Button>
    }
    onRequestDismiss={props.onDismiss}
  />
)

export default FastUnstakeDialog
