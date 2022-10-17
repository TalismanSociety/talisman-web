import { ComponentMeta, Story } from '@storybook/react'

import ToastBar, { ToastBarProps } from './ToastBar'

export default {
  title: 'Molecules/ToastBar',
  component: ToastBar,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ToastBar>

export const Default: Story<ToastBarProps> = (args: any) => <ToastBar {...args} />

Default.args = {
  toast: {
    id: '0',
    type: 'blank',
    visible: true,
    message: 'Your staking transaction has been confirmed',
    createdAt: Date.now(),
    pauseDuration: 0,
    ariaProps: { 'role': 'status', 'aria-live': 'assertive' },
  },
}

export const Loading = Default.bind({})

Loading.args = { toast: { ...Default.args.toast!, type: 'loading' } }

export const Success = Default.bind({})

Success.args = { toast: { ...Default.args.toast!, type: 'success' } }

export const Error = Default.bind({})

Error.args = { toast: { ...Default.args.toast!, type: 'error' } }
