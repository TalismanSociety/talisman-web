import { ComponentMeta, Story } from '@storybook/react'

import Details, { DetailsProps } from './Details'

export default {
  title: 'Molecules/Details',
  component: Details,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Details>

export const Default: Story<DetailsProps> = args => <Details {...args} />

Default.args = {
  summary: 'What is nomination pool staking?',
  content:
    'Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your behalf.',
}

export const WithMaxWidth: Story<DetailsProps> = args => <Details {...args} css={{ maxWidth: '400px' }} />

WithMaxWidth.args = {
  summary: 'What is nomination pool staking?',
  content:
    'Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your behalf.',
}
