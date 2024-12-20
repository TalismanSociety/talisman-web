import { type ComponentMeta, type Story } from '@storybook/react'

import type { AlertDialogProps } from './AlertDialog'
import { Button } from '../atoms/Button'
import { Text } from '../atoms/Text'
import { AlertDialog } from './AlertDialog'

export default {
  title: 'Molecules/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'default',
      values: [
        {
          name: 'default',
          value:
            "url('https://815904063-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F2G9cEppDnwuwiGautnGv%2Fuploads%2FY0qwQL5TJki0pJbWrjdJ%2Ftalismanmeeting.jpg?alt=media&token=aca2fd60-fe9e-4d5e-84fa-5b8dfa77b0ed')",
        },
      ],
    },
  },
} as ComponentMeta<typeof AlertDialog>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default: Story<AlertDialogProps> = (args: any) => <AlertDialog {...args} />

Default.args = {
  open: true,
  title: 'Unstake',
  content: (
    <>
      <Text.Body as="p">You are unstaking 4000 DOT ($23,988.55).</Text.Body>
      <Text.Body as="p">
        Please note that when unstaking there is a 28-day unstaking period before your funds become available.
      </Text.Body>
    </>
  ),
  dismissButton: <Button variant="outlined">Cancel</Button>,
  confirmButton: <Button>Confirm</Button>,
}
