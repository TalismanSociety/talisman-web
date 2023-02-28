import { ComponentMeta, Story } from '@storybook/react'

import BottomBorderNav, { BottomBorderNavProps } from './BottomBorderNav'

export default {
  title: 'Molecules/BottomBorderNav',
  component: BottomBorderNav,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof BottomBorderNav>

export const Default: Story<BottomBorderNavProps> = args => <BottomBorderNav {...args} css={{ width: '45vw' }} />

Default.args = {
  children: [
    <BottomBorderNav.Item key="foo" selected css={{ padding: '1.5rem 1rem' }}>
      Foo
    </BottomBorderNav.Item>,
    <BottomBorderNav.Item key="bar" css={{ padding: '1.5rem 1rem' }}>
      Bar
    </BottomBorderNav.Item>,
    <BottomBorderNav.Item key="baz" css={{ padding: '1.5rem 1rem' }}>
      Baz
    </BottomBorderNav.Item>,
  ],
}
