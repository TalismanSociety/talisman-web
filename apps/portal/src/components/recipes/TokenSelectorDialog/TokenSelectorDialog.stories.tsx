import Cryptoticon from '../Cryptoticon'
import TokenSelectorDialog, { type TokenSelectorDialogProps } from './TokenSelectorDialog'
import { type ComponentMeta, type Story } from '@storybook/react'

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
