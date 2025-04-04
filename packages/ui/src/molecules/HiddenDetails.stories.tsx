import { type ComponentMeta, type Story } from '@storybook/react'

import type { HiddenDetailsProps } from './HiddenDetails'
import { Button } from '../atoms/Button'
import { Text } from '../atoms/Text'
import { HiddenDetails } from './HiddenDetails'

export default {
  title: 'Molecules/HiddenDetails',
  component: HiddenDetails,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof HiddenDetails>

export const Default: Story<HiddenDetailsProps> = args => <HiddenDetails {...args} />

Default.args = {
  hidden: true,
  children: (
    <article>
      <header>
        <Text.H1>I'm a header</Text.H1>
      </header>
      <Text.Body as="p">And I'm the body</Text.Body>
    </article>
  ),
  overlay: (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '3.2rem',
      }}
    >
      <Text.Body>You have no staked assets yet...</Text.Body>
      <Button variant="outlined">Get started</Button>
    </div>
  ),
}
