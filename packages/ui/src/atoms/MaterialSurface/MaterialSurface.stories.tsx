import type { Meta, StoryObj } from '@storybook/react'
import MaterialSurface from './MaterialSurface'
import { Text } from '..'

export default {
  title: 'Atoms/MaterialSurface',
  component: MaterialSurface,
  parameters: {
    layout: 'centered',
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
} satisfies Meta<typeof MaterialSurface>

type Story = StoryObj<typeof MaterialSurface>

export const Default: Story = {
  args: { children: <Text.H1>Talisman</Text.H1>, style: { borderRadius: '1.6rem', padding: '2.4rem' } },
}
