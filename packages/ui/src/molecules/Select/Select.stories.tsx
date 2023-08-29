import { type ComponentMeta, type Story } from '@storybook/react'
import { useState } from 'react'

import { Identicon } from '../../atoms'
import Select, { type SelectProps } from './Select'

export default {
  title: 'Molecules/Select',
  component: Select,
  subcomponents: {
    SelectItem: Select.Item,
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div css={{ width: '30rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Select>

export const Default: Story<Partial<SelectProps<string>>> = props => {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  return (
    <Select placeholder="Select account" value={selected} onChange={value => setSelected(value)} {...props}>
      <Select.Option
        value={0}
        leadingIcon={<Identicon value="5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP" size={40} />}
        headlineText="Polkadot.js Import"
        supportingText="420 DOT"
      />
      <Select.Option
        value={1}
        leadingIcon={<Identicon value="143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs" size={40} />}
        headlineText="Yeet Account"
        supportingText="35 DOT"
      />
      <Select.Option
        value={2}
        leadingIcon={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size={40} />}
        headlineText="My Porkydot Account"
        supportingText="2,443.33 DOT"
      />
      <Select.Option
        value={3}
        leadingIcon={<Identicon value="16JfrnmcA7ncfANSXnyAzH9LRZ2gPRQhXforwKtdDhY4edpt" size={40} />}
        headlineText="My Porkydot Account"
        supportingText="2,443.33 DOT"
      />
    </Select>
  )
}

export const Detached: Story<Partial<SelectProps<string>>> = props => {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  return (
    <Select placeholder="Select account" value={selected} onChange={value => setSelected(value)} {...props} detached>
      <Select.Option
        value={0}
        leadingIcon={<Identicon value="5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP" size={40} />}
        headlineText="Polkadot.js Import"
        supportingText="420 DOT"
      />
      <Select.Option
        value={1}
        leadingIcon={<Identicon value="143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs" size={40} />}
        headlineText="Yeet Account"
        supportingText="35 DOT"
      />
      <Select.Option
        value={2}
        leadingIcon={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size={40} />}
        headlineText="My Porkydot Account"
        supportingText="2,443.33 DOT"
      />
      <Select.Option
        value={3}
        leadingIcon={<Identicon value="16JfrnmcA7ncfANSXnyAzH9LRZ2gPRQhXforwKtdDhY4edpt" size={40} />}
        headlineText="My Porkydot Account"
        supportingText="2,443.33 DOT"
      />
    </Select>
  )
}

export const ClearRequired = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  return (
    <Select placeholder="Select account" value={selected} onChange={value => setSelected(value)} clearRequired>
      <Select.Option
        value={0}
        leadingIcon={<Identicon value="5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP" size={40} />}
        headlineText="Polkadot.js Import"
        supportingText="420 DOT"
      />
      <Select.Option
        value={1}
        leadingIcon={<Identicon value="143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs" size={40} />}
        headlineText="Yeet Account"
        supportingText="35 DOT"
      />
      <Select.Option
        value={2}
        leadingIcon={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size={40} />}
        headlineText="My Porkydot Account"
        supportingText="2,443.33 DOT"
      />
      <Select.Option
        value={3}
        leadingIcon={<Identicon value="16JfrnmcA7ncfANSXnyAzH9LRZ2gPRQhXforwKtdDhY4edpt" size={40} />}
        headlineText="My Porkydot Account"
        supportingText="2,443.33 DOT"
      />
    </Select>
  )
}

export const Overflow = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  return (
    <div css={{ height: '50vh', overflow: 'auto', background: 'white', padding: 40 }}>
      <div css={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
        <Select placeholder="Select account" value={selected} onChange={value => setSelected(value)}>
          {Array.from({ length: 50 }, (_, index) => (
            <Select.Option
              key={index}
              value={index}
              leadingIcon={<Identicon value="5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP" size={40} />}
              headlineText="Polkadot.js Import"
              supportingText="420 DOT"
            />
          ))}
        </Select>
      </div>
    </div>
  )
}
