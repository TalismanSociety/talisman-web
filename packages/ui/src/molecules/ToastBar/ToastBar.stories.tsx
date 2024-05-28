import { Button } from '../../atoms'
import Toaster, { toast } from '../../organisms/Toaster'
import ToastBar, { ToastMessage, type ToastBarProps } from './ToastBar'
import { type ComponentMeta, type Story } from '@storybook/react'

export default {
  title: 'Molecules/ToastBar',
  component: ToastBar,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ToastBar>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default: Story<ToastBarProps> = (args: any) => <ToastBar {...args} />

Default.args = {
  toast: {
    id: '0',
    type: 'blank',
    visible: true,
    message: (
      <ToastMessage
        headlineContent="This is your toast"
        supportingContent="And this is its really really long content"
      />
    ),
    createdAt: Date.now(),
    pauseDuration: 0,
    ariaProps: { role: 'status', 'aria-live': 'assertive' },
  },
}

export const Loading = Default.bind({})

Loading.args = { toast: { ...Default.args.toast!, type: 'loading' } }

export const Success = Default.bind({})

Success.args = { toast: { ...Default.args.toast!, type: 'success' } }

export const Error = Default.bind({})

Error.args = { toast: { ...Default.args.toast!, type: 'error' } }

export const Demo: Story<ToastBarProps> = () => (
  <div css={{ display: 'flex', gap: '1rem' }}>
    <Toaster />
    <Button onClick={() => toast(Default.args?.toast?.message ?? '')}>Blank</Button>
    <Button onClick={() => toast.loading(Loading.args?.toast?.message ?? '', { duration: 4000 })}>Loading</Button>
    <Button onClick={() => toast.success(Success.args?.toast?.message ?? '')}>Success</Button>
    <Button onClick={() => toast.error(Error.args?.toast?.message ?? '')}>Error</Button>
  </div>
)
