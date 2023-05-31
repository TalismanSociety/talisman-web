import { type ComponentMeta, type Story } from '@storybook/react'
import { useState } from 'react'
import Tab, { type TabProps } from './Tab'

export default {
  title: 'Molecules/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Tab>

export const Default: Story<TabProps> = () => {
  const [selected, setSelected] = useState('Assets')
  const items = ['Assets', 'Collectibles', 'History']

  return (
    <Tab>
      {items.map(x => (
        <Tab.Item key={x} selected={x === selected} onClick={() => setSelected(x)}>
          {x}
        </Tab.Item>
      ))}
    </Tab>
  )
}
