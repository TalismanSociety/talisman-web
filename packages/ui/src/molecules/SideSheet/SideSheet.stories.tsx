import { Global, css } from '@emotion/react'
import { type ComponentMeta, type Story } from '@storybook/react'

import { Text } from '../../atoms'
import TextInput from '../TextInput'
import SideSheet, { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, type SideSheetProps } from './SideSheet'

export default {
  title: 'Molecules/SideSheet',
  component: SideSheet,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SideSheet>

export const Default: Story<SideSheetProps> = (args: any) => (
  <>
    <Global
      styles={css`
        body {
          background-image: url('https://815904063-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F2G9cEppDnwuwiGautnGv%2Fuploads%2FY0qwQL5TJki0pJbWrjdJ%2Ftalismanmeeting.jpg?alt=media&token=aca2fd60-fe9e-4d5e-84fa-5b8dfa77b0ed');
          background-size: cover;
        }
      `}
    />
    <SideSheet {...args} />
  </>
)

Default.args = {
  open: true,
  title: 'Unstake',
  children: (
    <div css={{ [`${SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR}`]: { minWidth: 412 } }}>
      <TextInput leadingLabel="Unstaking amount" />
      <Text.Body as="p">You are unstaking 4000 DOT ($23,988.55).</Text.Body>
      <Text.Body as="p">
        Please note that when unstaking there is a 28-day unstaking period before your funds become available.
      </Text.Body>
    </div>
  ),
}
