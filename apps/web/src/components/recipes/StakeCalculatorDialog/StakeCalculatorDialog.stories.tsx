import { type Meta, type StoryObj } from '@storybook/react'

import StakeCalculatorDialog from './StakeCalculatorDialog'
import { Select } from '@talismn/ui'

export default {
  title: 'Recipes/StakeCalculatorDialog',
  component: StakeCalculatorDialog,
} satisfies Meta<typeof StakeCalculatorDialog>

type Story = StoryObj<typeof StakeCalculatorDialog>

export const Default: Story = {
  args: {
    assetSelector: <Select placeholder="Select asset" />,
    yield: (
      <StakeCalculatorDialog.EstimatedYield
        dailyYield="10 DOT"
        weeklyYield="10 DOT"
        monthlyYield="10 DOT"
        annualYield="10 DOT"
      />
    ),
  },
}
