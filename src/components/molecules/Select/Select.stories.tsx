import Identicon from '@polkadot/react-identicon'
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
  argTypes: {},
} as ComponentMeta<typeof Select>

export const Default = () => {
  const [selected, setSelected] = useState<1 | 2 | 3 | undefined>(undefined)

  return (
    <Select>
      <Select.Item
        selected={selected === 1}
        leadingIcon={<Identicon value="5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP" size={40} theme="polkadot" />}
        headlineText="Polkadot.js Import"
        supportingText="420 DOT"
        onClick={() => setSelected(1)}
      />
      <Select.Item
        selected={selected === 2}
        leadingIcon={<Identicon value="143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs" size={40} theme="polkadot" />}
        headlineText="Yeet Account"
        supportingText="35 DOT"
        onClick={() => setSelected(2)}
      />
      <Select.Item
        selected={selected === 3}
        leadingIcon={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size={40} theme="polkadot" />}
        headlineText="My Porkydot Account"
        supportingText="2,443.33 DOT"
        onClick={() => setSelected(3)}
      />
    </Select>
  )
}
