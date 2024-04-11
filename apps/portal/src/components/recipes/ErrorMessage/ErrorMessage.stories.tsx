import { type ComponentMeta, type Story } from '@storybook/react'
import { Button } from '@talismn/ui'
import ErrorMessage, { type ErrorMessageProps } from './ErrorMessage'

export default {
  title: 'Recipes/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ErrorMessage>

export const Default: Story<ErrorMessageProps> = (args: any) => <ErrorMessage {...args} />

Default.args = {
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
}

export const Horizontal = Default.bind({})

Horizontal.args = {
  ...Default.args,
  orientation: 'horizontal',
}
