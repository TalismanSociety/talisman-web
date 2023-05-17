import { type ComponentMeta, type Story } from '@storybook/react'

import Cryptoticon, { type CryptoticonProps } from './Cryptoticon'

export default {
  title: 'Recipes/Cryptoticon',
  component: Cryptoticon,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Cryptoticon>

const decorators = [
  (Story: any) => (
    <Cryptoticon.Provider>
      <Story />
    </Cryptoticon.Provider>
  ),
]

export const Default: Story<CryptoticonProps> = () => <Cryptoticon.Token id="polkadot-substrate-native-dot" />

Default.decorators = decorators

export const Loading: Story<CryptoticonProps> = () => <Cryptoticon.Token id="polkadot-substrate-native-dot" />

export const Unknown: Story<CryptoticonProps> = () => <Cryptoticon.Token id="bull-crap" />

Unknown.decorators = decorators
