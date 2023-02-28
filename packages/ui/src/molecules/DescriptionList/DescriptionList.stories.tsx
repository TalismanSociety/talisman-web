import { ComponentMeta, Story } from '@storybook/react'

import { Text } from '../../atoms'
import DescriptionList from './DescriptionList'

export default {
  title: 'Molecules/DescriptionList',
  component: DescriptionList,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof DescriptionList>

export const Default: Story = args => (
  <DescriptionList>
    <DescriptionList.Description>
      <DescriptionList.Term>Unstake amount</DescriptionList.Term>
      <DescriptionList.Details>
        <Text.Body alpha="high">3244.69 DOT</Text.Body>
        <Text.Body>$214,544.55</Text.Body>
      </DescriptionList.Details>
    </DescriptionList.Description>
  </DescriptionList>
)
