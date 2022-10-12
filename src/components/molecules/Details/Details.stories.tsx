import { Global, css } from '@emotion/react'
import { ComponentMeta } from '@storybook/react'

import Details from './Details'

export default {
  title: 'Molecules/Details',
  component: Details,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    summary: {
      defaultValue: 'What is nomination pool staking?',
    },
    contents: {
      defaultValue:
        'Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your behalf.',
    },
  },
} as ComponentMeta<typeof Details>

export const Default = (args: any) => <Details {...args} />
