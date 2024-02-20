import { type ComponentMeta, type Story } from '@storybook/react'
import { TalismanHand } from '@talismn/web-icons'

import IconButton, { type IconButtonProps } from './IconButton'

export default {
  title: 'Atoms/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof IconButton>

export const Default: Story<IconButtonProps<'button'>> = args => <IconButton {...args} />

Default.args = {
  children: <TalismanHand />,
}
