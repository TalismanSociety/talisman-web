import Text from '@components/atoms/Text'
import { ComponentMeta, Story } from '@storybook/react'

import InfoWithHeader, { InfoWithHeaderProps } from './InfoWithHeader'

export default {
  title: 'Molecules/InfoWithHeader',
  component: InfoWithHeader,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof InfoWithHeader>

export const Default: Story<InfoWithHeaderProps> = (args: any) => <InfoWithHeader {...args} />

Default.args = {
  headerText: 'The Talisman Collection',
  content: <Text.H3>Spirit Key #4200</Text.H3>,
}
