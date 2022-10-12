import { Global, css } from '@emotion/react'
import { ComponentMeta, Story } from '@storybook/react'

import Details, { DetailsProps } from './Details'

export default {
  title: 'Molecules/Details',
  component: Details,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Details>

export const Default: Story<DetailsProps> = (args: any) => <Details {...args} />

Default.args = {
  summary: 'What is nomination pool staking?',
  content:
    'Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your behalf.',
}
