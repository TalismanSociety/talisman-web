import Button from '@components/atoms/Button'
import Text from '@components/atoms/Text'
import { Global, css } from '@emotion/react'
import { ComponentMeta } from '@storybook/react'

import AlertDialog from './AlertDialog'

export default {
  title: 'Molecules/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: { type: 'boolean' },
    title: { defaultValue: 'Unstake' },
    text: {
      defaultValue: (
        <>
          <Text.Body as="p">You are unstaking 4000 DOT ($23,988.55).</Text.Body>
          <Text.Body as="p">
            Please note that when unstaking there is a 28-day unstaking period before your funds become available.
          </Text.Body>
        </>
      ),
    },
    dismissButton: {
      defaultValue: <Button variant="outlined">Cancel</Button>,
    },
    confirmButton: {
      defaultValue: <Button>Confirm</Button>,
    },
  },
} as ComponentMeta<typeof AlertDialog>

export const Default = (args: any) => (
  <>
    <Global
      styles={css`
        body {
          background-image: url('https://815904063-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F2G9cEppDnwuwiGautnGv%2Fuploads%2FY0qwQL5TJki0pJbWrjdJ%2Ftalismanmeeting.jpg?alt=media&token=aca2fd60-fe9e-4d5e-84fa-5b8dfa77b0ed');
          background-size: cover;
        }
      `}
    />
    <AlertDialog {...args} />
  </>
)
