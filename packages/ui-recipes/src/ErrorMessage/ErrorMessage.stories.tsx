import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@talismn/ui'
import ErrorMessage from './ErrorMessage'

export default {
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ErrorMessage>

type Story = StoryObj<typeof ErrorMessage>

export const Default: Story = {
  args: {
    title: 'Oops !',
    message: 'Sorry, an error occurred in Talisman.',
    actions: (
      <ErrorMessage.Actions>
        <Button
          onClick={() => {
            const error = new Error()
            alert(`${error.message}\n\n${error.stack ?? ''}`)
          }}
        >
          Show
        </Button>
        <Button>Retry</Button>
      </ErrorMessage.Actions>
    ),
  },
}

export const Horizontal: Story = {
  args: {
    ...Default.args,
    orientation: 'horizontal',
  },
}
