import RadioButton from './RadioButton'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Atoms/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RadioButton>

type Story = StoryObj<typeof RadioButton>

export const Default: Story = {}
