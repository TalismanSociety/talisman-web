import { Global, css } from '@emotion/react'
import { type ComponentMeta, type Story } from '@storybook/react'

import { Text } from '../../atoms'
import TextInput from '../TextInput'
import FullScreenDialog, { FulScreenDialogQuarterSelector, type FullScreenDialogProps } from './FullScreenDialog'

export default {
  title: 'Molecules/FullScreenDialog',
  component: FullScreenDialog,
  subcomponents: {
    Toast: FullScreenDialog.Toast,
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof FullScreenDialog>

export const Default: Story<FullScreenDialogProps> = (args: any) => (
  <>
    <Global
      styles={css`
        body {
          background-image: url('https://815904063-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F2G9cEppDnwuwiGautnGv%2Fuploads%2FY0qwQL5TJki0pJbWrjdJ%2Ftalismanmeeting.jpg?alt=media&token=aca2fd60-fe9e-4d5e-84fa-5b8dfa77b0ed');
          background-size: cover;
        }
      `}
    />
    <FullScreenDialog {...args} />
  </>
)

Default.args = {
  open: true,
  title: 'Unstake',
  children: (
    <div css={{ [`${FulScreenDialogQuarterSelector}`]: { minWidth: 412 } }}>
      <TextInput leadingLabel="Unstaking amount" />
      <Text.Body as="p">You are unstaking 4000 DOT ($23,988.55).</Text.Body>
      <Text.Body as="p">
        Please note that when unstaking there is a 28-day unstaking period before your funds become available.
      </Text.Body>
    </div>
  ),
}

export const Pending = Default.bind({})

Pending.args = {
  ...Default.args,
  toast: <FullScreenDialog.Toast type="loading" headlineText="Your transaction is pending..." />,
}

export const Success = Default.bind({})

Success.args = {
  ...Default.args,
  toast: <FullScreenDialog.Toast type="success" headlineText="Your transaction was successful" />,
}

export const Error = Default.bind({})

Error.args = { ...Default.args, toast: <FullScreenDialog.Toast type="error" headlineText=" Your transaction failed" /> }
