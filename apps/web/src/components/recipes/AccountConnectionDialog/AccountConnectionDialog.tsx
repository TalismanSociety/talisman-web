import Button from '@components/atoms/Button'
import Hr from '@components/atoms/Hr'
import Text from '@components/atoms/Text'
import AlertDialog from '@components/molecules/AlertDialog'
import TextInput from '@components/molecules/TextInput'

export type AccountConnectionDialogProps = {
  open?: boolean
  onRequestDismiss: () => unknown
}

const AccountConnectionDialog = (props: AccountConnectionDialogProps) => {
  return (
    <AlertDialog
      open={props.open}
      onRequestDismiss={props.onRequestDismiss}
      content={
        <div>
          <section css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Text.H2 css={{ textAlign: 'center' }}>Welcome to the Talisman Portal</Text.H2>
            <Button>Connect wallet</Button>
          </section>
          <Hr css={{ margin: '4.8rem' }} />
          <section>
            <Text.Body as="h2" css={{ textAlign: 'center' }}>
              Or lookup any wallet address
            </Text.Body>
            <form
              css={{
                '@media (min-width: 1024px)': {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              }}
            >
              <div css={{ flex: 1 }}>
                <TextInput width="100%" />
              </div>
              <div>
                <Button variant="outlined" css={{ width: '100%' }}>
                  Add
                </Button>
              </div>
            </form>
          </section>
          <section css={{ marginTop: '4.8rem' }}>
            <Text.Body as="h2" css={{ textAlign: 'center' }}>
              Or lookup some of the popular addresses
            </Text.Body>
          </section>
        </div>
      }
    />
  )
}

export default AccountConnectionDialog
