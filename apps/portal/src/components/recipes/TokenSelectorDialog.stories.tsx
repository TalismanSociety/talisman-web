import { type ComponentMeta, type Story } from '@storybook/react'

import { Cryptoticon } from '@/components/recipes/Cryptoticon'

import type { TokenSelectorDialogProps } from './TokenSelectorDialog'
import { TokenSelectorDialog } from './TokenSelectorDialog'

export default {
  title: 'Recipes/TokenSelectorDialog',
  component: TokenSelectorDialog,
  decorators: [
    Story => (
      <Cryptoticon.Provider>
        <Story />
      </Cryptoticon.Provider>
    ),
  ],
} as ComponentMeta<typeof TokenSelectorDialog>

export const Default: Story<TokenSelectorDialogProps> = args => <TokenSelectorDialog {...args} />

Default.args = {}
