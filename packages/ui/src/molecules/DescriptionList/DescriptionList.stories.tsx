import { type ComponentMeta, type Story } from '@storybook/react'

import { Text } from '../../atoms'
import DescriptionList from './DescriptionList'

export default {
  title: 'Molecules/DescriptionList',
  component: DescriptionList,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof DescriptionList>

export const Default: Story = () => (
  <DescriptionList>
    <DescriptionList.Description>
      <DescriptionList.Term>Unstake amount</DescriptionList.Term>
      <DescriptionList.Details>
        <Text.Body as="div" alpha="high">
          3244.69 DOT
        </Text.Body>
        <Text.Body as="div">$214,544.55</Text.Body>
      </DescriptionList.Details>
    </DescriptionList.Description>
  </DescriptionList>
)
