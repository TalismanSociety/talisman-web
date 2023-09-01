import { type ComponentMeta, type Story } from '@storybook/react'
import { useState } from 'react'
import Tabs, { type TabsProps } from './Tabs'

export default {
  title: 'Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Tabs>

export const Default: Story<TabsProps> = () => {
  const [selected, setSelected] = useState('Assets')
  const items = ['Assets', 'Collectibles', 'History']

  return (
    <Tabs>
      {items.map(x => (
        <Tabs.Item key={x} selected={x === selected} onClick={() => setSelected(x)}>
          {x}
        </Tabs.Item>
      ))}
    </Tabs>
  )
}
