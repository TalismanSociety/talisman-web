import type { Meta, StoryObj } from '@storybook/react'
import RadioButton from './RadioButton'

export default {
  title: 'Atoms/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RadioButton>

type Story = StoryObj<typeof RadioButton>

export const Default: Story = {}
