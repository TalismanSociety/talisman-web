import { ComponentMeta } from '@storybook/react'
import { useState } from 'react'

import Select from './Select'

export default {
  title: 'Molecules/Select',
  component: Select,
  subcomponents: {
    SelectItem: Select.Item,
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Select>

export const Default = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  return (
    <Select placeholder="Select account" value={selected} onChange={value => setSelected(value)}>
      <Select.Item value={0}>All collections</Select.Item>
      <Select.Item value={1}>Talisman Spirits Keys</Select.Item>
      <Select.Item value={2}>Talisman Commendations</Select.Item>
      <Select.Item value={3}>Dudes</Select.Item>
    </Select>
  )
}

export const ToggleNoBackground = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  return (
    <Select
      placeholder="Select account"
      value={selected}
      onChange={value => setSelected(value)}
      variant="toggle-no-background"
    >
      <Select.Item value={0}>All collections</Select.Item>
      <Select.Item value={1}>Talisman Spirits Keys</Select.Item>
      <Select.Item value={2}>Talisman Commendations</Select.Item>
      <Select.Item value={3}>Dudes</Select.Item>
    </Select>
  )
}

export const WithLabel = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  return (
    <Select.Label>
      Collection:
      <Select
        placeholder="Select account"
        value={selected}
        onChange={value => setSelected(value)}
        variant="toggle-no-background"
      >
        <Select.Item value={0}>All collections</Select.Item>
        <Select.Item value={1}>Talisman Spirits Keys</Select.Item>
        <Select.Item value={2}>Talisman Commendations</Select.Item>
        <Select.Item value={3}>Dudes</Select.Item>
      </Select>
    </Select.Label>
  )
}

export const Overflow = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  return (
    <div css={{ height: '50vh', overflow: 'auto', background: 'white', padding: 40 }}>
      <div css={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
        <Select placeholder="Select account" value={selected} onChange={value => setSelected(value)}>
          {Array.from({ length: 50 }, (_, index) => (
            <Select.Item key={index} value={index}>
              All collections
            </Select.Item>
          ))}
        </Select>
      </div>
    </div>
  )
}
